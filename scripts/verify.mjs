import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, rmSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const projectRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
)
const baseUrl = process.env.BASE_URL || 'http://127.0.0.1:4173'
const chromePath =
  process.env.CHROME_PATH || '/usr/bin/google-chrome'
const screenshotDir = path.resolve(
  projectRoot,
  process.env.SCREENSHOT_DIR || 'test-artifacts',
)
const axePath = path.join(projectRoot, 'node_modules', 'axe-core', 'axe.min.js')
const distPath = path.join(projectRoot, 'dist', 'index.html')

const checks = []
const consoleErrors = []
const pageErrors = []
const requestFailures = []
let serverProcess = null

function check(name, passed, details = '') {
  checks.push({ name, passed, details })
  console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}${details ? ` — ${details}` : ''}`)
}

async function wait(ms) {
  await new Promise((resolve) => setTimeout(resolve, ms))
}

async function isReachable(url) {
  try {
    const response = await fetch(url, { redirect: 'manual' })
    return response.status < 500
  } catch {
    return false
  }
}

async function ensureServer() {
  if (await isReachable(baseUrl)) return

  if (!existsSync(distPath)) {
    throw new Error('Production build missing. Run npm run build first.')
  }

  let logs = ''
  serverProcess = spawn(
    'npm',
    [
      'run',
      'preview',
      '--',
      '--host',
      '127.0.0.1',
      '--port',
      '4173',
      '--strictPort',
    ],
    {
      cwd: projectRoot,
      detached: true,
      env: { ...process.env, BROWSER: 'none' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  )

  serverProcess.stdout.on('data', (chunk) => {
    logs += chunk.toString()
  })
  serverProcess.stderr.on('data', (chunk) => {
    logs += chunk.toString()
  })

  const deadline = Date.now() + 30000
  while (Date.now() < deadline) {
    if (await isReachable(baseUrl)) return
    await wait(300)
  }

  throw new Error(`Preview server did not start.\n${logs}`)
}

function stopServer() {
  if (!serverProcess) return
  try {
    process.kill(-serverProcess.pid, 'SIGTERM')
  } catch {
    serverProcess.kill('SIGTERM')
  }
}

function getTomorrowIso() {
  const date = new Date()
  date.setDate(date.getDate() + 1)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

async function settlePage(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    const step = Math.max(320, Math.floor(window.innerHeight * 0.62))

    for (let pass = 0; pass < 2; pass += 1) {
      const height = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      )
      for (let y = 0; y < height; y += step) {
        window.scrollTo(0, y)
        await pause(45)
      }
      window.scrollTo(0, height)
      await pause(900)
    }

    window.scrollTo(0, 0)
    await pause(300)
  })

  await page.evaluate(async () => {
    await document.fonts.ready
    const images = Array.from(document.images)
    await Promise.all(
      images.map((image) =>
        image.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              image.addEventListener('load', resolve, { once: true })
              image.addEventListener('error', resolve, { once: true })
              setTimeout(resolve, 4000)
            }),
      ),
    )
  })

  await page.waitForTimeout(500)
}

async function captureViewport(page, filename) {
  await page.screenshot({
    path: path.join(screenshotDir, filename),
    animations: 'disabled',
    timeout: 60000,
  })
}

async function captureSection(page, selector, filename) {
  await page.locator(selector).evaluate((element) => {
    element.scrollIntoView({ block: 'start', behavior: 'instant' })
  })
  await page.waitForTimeout(300)
  await captureViewport(page, filename)
}

async function capturePageBottom(page, filename) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(300)
  await captureViewport(page, filename)
}

async function getOverflow(page) {
  return page.evaluate(() => ({
    innerWidth: window.innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    bodyWidth: document.body.scrollWidth,
  }))
}

async function runAxe(page, label) {
  await page.addScriptTag({ path: axePath })
  const results = await page.evaluate(async () => {
    return window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: [
          'wcag2a',
          'wcag2aa',
          'wcag21a',
          'wcag21aa',
          'wcag22aa',
        ],
      },
    })
  })

  const violations = results.violations.map((violation) => ({
    id: violation.id,
    impact: violation.impact,
    help: violation.help,
    nodes: violation.nodes.map((node) => ({
      target: node.target.join(' '),
      summary: node.failureSummary,
    })),
  }))

  check(
    `${label} axe accessibility`,
    violations.length === 0,
    violations.length === 0
      ? `${results.passes.length} rules passed`
      : `${violations.length} violation(s): ${violations
          .map((violation) => violation.id)
          .join(', ')}`,
  )

  if (violations.length > 0) {
    console.log(JSON.stringify(violations, null, 2))
  }
}

async function main() {
  if (!existsSync(chromePath)) {
    throw new Error(`Chrome not found at ${chromePath}`)
  }

  if (!existsSync(axePath)) {
    throw new Error('axe-core is not installed')
  }

  if (existsSync(screenshotDir)) {
    rmSync(screenshotDir, { recursive: true, force: true })
  }
  mkdirSync(screenshotDir, { recursive: true })

  await ensureServer()

  const browser = await chromium.launch({
    executablePath: chromePath,
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  try {
    const context = await browser.newContext({
      viewport: { width: 1440, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: 'no-preference',
    })
    const page = await context.newPage()

    page.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(message.text())
      }
    })
    page.on('pageerror', (error) => pageErrors.push(error.message))
    page.on('requestfailed', (request) => {
      const failure = request.failure()
      if (failure && !failure.errorText.includes('ERR_ABORTED')) {
        requestFailures.push(`${request.url()} — ${failure.errorText}`)
      }
    })

    const response = await page.goto(baseUrl, { waitUntil: 'networkidle' })
    await page.waitForSelector('#hero-title')
    await page.evaluate(() => document.fonts.ready)

    check('Homepage responds successfully', response?.ok() === true, `HTTP ${response?.status()}`)
    check(
      'Document title is set',
      (await page.title()).includes('Élora Beauty Studio'),
      await page.title(),
    )
    check(
      'Primary heading is present',
      (await page.locator('h1').innerText()).includes('Where beauty'),
    )

    for (const width of [1440, 1200, 1024, 920, 820, 768, 640, 390, 360, 320]) {
      await page.setViewportSize({
        width,
        height: width >= 900 ? 1000 : 850,
      })
      await page.waitForTimeout(120)
      const overflow = await getOverflow(page)
      check(
        `No horizontal overflow at ${width}px`,
        overflow.documentWidth <= overflow.innerWidth + 1,
        `${overflow.documentWidth}px document / ${overflow.innerWidth}px viewport`,
      )
    }

    await page.setViewportSize({ width: 1440, height: 1000 })
    await settlePage(page)

    const imageResults = await page.evaluate(() =>
      Array.from(document.images).map((image) => ({
        src: image.currentSrc || image.src,
        complete: image.complete,
        naturalWidth: image.naturalWidth,
      })),
    )
    const brokenImages = imageResults.filter(
      (image) => !image.complete || image.naturalWidth === 0,
    )
    check(
      'All images load',
      brokenImages.length === 0,
      `${imageResults.length} images checked${
        brokenImages.length > 0
          ? `; broken: ${brokenImages.map((image) => image.src).join(', ')}`
          : ''
      }`,
    )

    const hiddenReveals = await page.locator('.reveal:not(.is-visible)').count()
    check('Scroll reveal content becomes visible', hiddenReveals === 0, `${hiddenReveals} hidden`)

    await page.evaluate(() => window.scrollTo(0, 0))
    await captureViewport(page, 'desktop-home.png')
    await captureSection(page, '#atelier', 'desktop-atelier.png')
    await captureSection(page, '#services', 'desktop-services.png')
    await captureSection(page, '#bridal', 'desktop-bridal.png')
    await captureSection(page, '#gallery', 'desktop-gallery.png')
    await captureSection(page, '#pricing', 'desktop-pricing.png')
    await captureSection(page, '#testimonials', 'desktop-testimonials.png')
    await captureSection(page, '#contact', 'desktop-contact.png')
    await capturePageBottom(page, 'desktop-footer.png')

    await page.setViewportSize({ width: 820, height: 1180 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(250)
    await captureViewport(page, 'tablet-home.png')

    await page.setViewportSize({ width: 1440, height: 1000 })
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.waitForTimeout(200)

    await page.locator('#services .service-row').first().click()
    await page.waitForTimeout(350)
    check(
      'Service selection preselects the enquiry form',
      (await page.locator('#field-service').inputValue()) === 'Bridal Artistry',
      await page.locator('#field-service').inputValue(),
    )

    await page.locator('#gallery').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: 'Bridal', exact: true }).click()
    await page.waitForTimeout(250)
    const bridalCards = page.locator('.gallery-card')
    check(
      'Gallery category filter works',
      (await bridalCards.count()) === 2,
      `${await bridalCards.count()} Bridal images`,
    )

    await bridalCards.first().click()
    const lightbox = page.locator('.lightbox')
    await lightbox.waitFor({ state: 'visible' })
    check('Gallery lightbox opens', await lightbox.isVisible())
    const firstCounter = await lightbox.locator('.lightbox__counter').innerText()
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(200)
    const secondCounter = await lightbox.locator('.lightbox__counter').innerText()
    check(
      'Gallery lightbox keyboard navigation works',
      firstCounter !== secondCounter && secondCounter.trim() === '2 / 2',
      `${firstCounter.trim()} → ${secondCounter.trim()}`,
    )
    await page.keyboard.press('Escape')
    await lightbox.waitFor({ state: 'detached' })
    check('Gallery lightbox closes with Escape', true)

    await page.locator('#testimonials').scrollIntoViewIfNeeded()
    const firstQuote = await page.locator('.testimonial-quote blockquote').innerText()
    await page.getByRole('button', { name: 'Show next testimonial' }).click()
    await page.waitForTimeout(200)
    const secondQuote = await page.locator('.testimonial-quote blockquote').innerText()
    check('Testimonial carousel changes quote', firstQuote !== secondQuote)

    await page.locator('#appointment').scrollIntoViewIfNeeded()
    await page.getByRole('button', { name: /Send enquiry via WhatsApp/i }).click()
    await page.locator('#error-name').waitFor({ state: 'visible' })
    check(
      'Form validation displays errors',
      (await page.locator('#field-name').getAttribute('aria-invalid')) === 'true',
    )
    check(
      'Form validation moves focus to first invalid field',
      await page.locator('#field-name').evaluate((element) => document.activeElement === element),
    )

    await page.evaluate(() => {
      window.__eloraCapturedLinks = []
      HTMLAnchorElement.prototype.click = function captureLinkClick() {
        window.__eloraCapturedLinks.push({
          href: this.href,
          target: this.target,
        })
      }
    })

    await page.getByLabel(/Full name/).fill('Test Guest')
    await page.getByLabel(/Phone \/ WhatsApp/).fill('9876543210')
    await page.getByLabel(/Ritual of interest/).selectOption({
      label: 'Bridal Artistry',
    })
    await page.locator('#field-date').fill(getTomorrowIso())
    await page.getByLabel(/Preferred time/).selectOption({ index: 1 })
    await page
      .getByLabel(/I understand this is a fictional demo/)
      .check()

    await page.getByRole('button', { name: /Send enquiry via WhatsApp/i }).click()
    await page.locator('#form-feedback.is-visible').waitFor({ state: 'visible' })
    await page.waitForFunction(
      () => window.__eloraCapturedLinks?.length > 0,
    )

    const capturedHref = await page.evaluate(
      () => window.__eloraCapturedLinks[0].href,
    )
    const feedbackHref = await page.locator('#form-feedback a').getAttribute('href')
    const decodedMessage = decodeURIComponent(
      (capturedHref.split('text=')[1] || '').replace(/\+/g, ' '),
    )

    check(
      'Valid form produces a WhatsApp enquiry link',
      capturedHref.startsWith('https://wa.me/'),
      capturedHref.split('?')[0],
    )
    check(
      'WhatsApp message contains the enquiry details',
      decodedMessage.includes('Service: Bridal Artistry') &&
        decodedMessage.includes('Name: Test Guest') &&
        decodedMessage.includes('Phone: 9876543210'),
    )
    check(
      'Success feedback exposes a fallback WhatsApp link',
      feedbackHref === capturedHref,
    )

    check('No browser console errors', consoleErrors.length === 0, consoleErrors.join(' | '))
    check('No uncaught page errors', pageErrors.length === 0, pageErrors.join(' | '))
    check(
      'No failed network requests',
      requestFailures.length === 0,
      requestFailures.join(' | '),
    )

    await page.reload({ waitUntil: 'networkidle' })
    await settlePage(page)
    await runAxe(page, 'Desktop')

    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      reducedMotion: 'no-preference',
    })
    const mobilePage = await mobileContext.newPage()

    mobilePage.on('console', (message) => {
      if (message.type() === 'error') {
        consoleErrors.push(`mobile: ${message.text()}`)
      }
    })
    mobilePage.on('pageerror', (error) => {
      pageErrors.push(`mobile: ${error.message}`)
    })

    const mobileResponse = await mobilePage.goto(baseUrl, {
      waitUntil: 'networkidle',
    })
    await mobilePage.evaluate(() => document.fonts.ready)
    check('Mobile homepage responds successfully', mobileResponse?.ok() === true)

    await settlePage(mobilePage)
    const mobileOverflow = await getOverflow(mobilePage)
    check(
      'No horizontal overflow on mobile',
      mobileOverflow.documentWidth <= mobileOverflow.innerWidth + 1,
      `${mobileOverflow.documentWidth}px document / ${mobileOverflow.innerWidth}px viewport`,
    )

    await mobilePage.evaluate(() => window.scrollTo(0, 0))
    await captureViewport(mobilePage, 'mobile-home.png')
    await captureSection(mobilePage, '#atelier', 'mobile-atelier.png')
    await captureSection(mobilePage, '#services', 'mobile-services.png')
    await captureSection(mobilePage, '#bridal', 'mobile-bridal.png')
    await captureSection(mobilePage, '#gallery', 'mobile-gallery.png')
    await captureSection(mobilePage, '#contact', 'mobile-contact.png')
    await capturePageBottom(mobilePage, 'mobile-footer.png')
    await mobilePage.evaluate(() => window.scrollTo(0, 0))
    await mobilePage.waitForTimeout(300)

    const menuButton = mobilePage.getByRole('button', { name: 'Open menu' })
    await menuButton.click()
    const mobileMenu = mobilePage.locator('.mobile-menu')
    await mobileMenu.waitFor({ state: 'visible' })
    check(
      'Mobile menu opens and locks page scroll',
      (await mobilePage.locator('body').evaluate((body) => body.style.overflow)) === 'hidden',
    )
    check(
      'Mobile menu contains focus',
      await mobileMenu.evaluate((menu) => menu.contains(document.activeElement)),
    )
    await captureViewport(mobilePage, 'mobile-menu.png')
    await mobilePage.keyboard.press('Escape')
    await mobileMenu.waitFor({ state: 'detached' })
    check(
      'Mobile menu closes with Escape and restores focus',
      await menuButton.evaluate((button) => document.activeElement === button),
    )

    await mobilePage.reload({ waitUntil: 'networkidle' })
    await settlePage(mobilePage)
    await runAxe(mobilePage, 'Mobile')

    await mobileContext.close()
    await context.close()
  } finally {
    await browser.close()
    stopServer()
  }

  const failures = checks.filter((item) => !item.passed)
  console.log(`\n${checks.length - failures.length}/${checks.length} checks passed.`)
  if (failures.length > 0) {
    console.log('Failed checks:')
    for (const failure of failures) {
      console.log(`- ${failure.name}${failure.details ? `: ${failure.details}` : ''}`)
    }
    process.exitCode = 1
  } else {
    console.log(`Screenshots saved in ${screenshotDir}`)
  }
}

try {
  await main()
} catch (error) {
  stopServer()
  console.error(error)
  process.exitCode = 1
}
