import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { navItems, siteConfig } from '../config/site'
import { useFocusTrap } from '../hooks/useFocusTrap'
import { Logo } from './Logo'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useFocusTrap(menuOpen, menuRef, closeMenu, closeButtonRef)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const sectionIds = navItems.map((item) => item.href.slice(1))
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      { rootMargin: '-38% 0px -54% 0px', threshold: 0 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`.trim()}>
      <div className="announcement">
        <p>
          <span className="announcement__seal" aria-hidden="true">
            ✦
          </span>
          <span className="announcement__long">
            A fictional beauty atelier · All details illustrative
          </span>
          <span className="announcement__short">
            Concept demo · Fictional studio
          </span>
          <span className="announcement__seal" aria-hidden="true">
            ✦
          </span>
        </p>
      </div>

      <div className="nav-shell">
        <div className="nav-inner container">
          <Logo />

          <nav className="desktop-nav" aria-label="Primary">
            {navItems.map((item) => {
              const id = item.href.slice(1)
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={activeSection === id ? 'is-active' : undefined}
                  aria-current={
                    activeSection === id ? 'location' : undefined
                  }
                >
                  {item.label}
                </a>
              )
            })}
          </nav>

          <div className="nav-actions">
            <a className="button button--nav" href="#appointment">
              <span>Book an appointment</span>
              <ArrowUpRight size={16} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <button
              ref={menuButtonRef}
              type="button"
              className="menu-toggle"
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} strokeWidth={1.4} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen ? (
        <div
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <div className="mobile-menu__top container">
            <Logo light onClick={closeMenu} />
            <button
              ref={closeButtonRef}
              type="button"
              className="mobile-menu__close"
              aria-label="Close menu"
              onClick={closeMenu}
            >
              <X size={26} strokeWidth={1.3} aria-hidden="true" />
            </button>
          </div>

          <nav
            className="mobile-menu__nav container"
            aria-label="Mobile primary"
          >
            {navItems.map((item, index) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                <span className="mobile-menu__index">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span>{item.label}</span>
                <ArrowUpRight
                  size={24}
                  strokeWidth={1.1}
                  aria-hidden="true"
                />
              </a>
            ))}
          </nav>

          <div className="mobile-menu__footer container">
            <a
              className="button button--light"
              href="#appointment"
              onClick={closeMenu}
            >
              Reserve your appointment
            </a>
            <div className="mobile-menu__contact">
              <a href={siteConfig.contact.phoneHref}>
                {siteConfig.contact.phone}
              </a>
              <span>{siteConfig.contact.note}</span>
            </div>
            <p>{siteConfig.demo.shortNote}</p>
          </div>
        </div>
      ) : null}
    </header>
  )
}
