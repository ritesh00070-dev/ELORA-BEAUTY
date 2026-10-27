import { ArrowUpRight } from 'lucide-react'
import { formatInr, packages } from '../data/content'
import { BloomMark } from './BloomMark'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type BridalProps = {
  onSelectService: (serviceName: string) => void
}

const bridalPackage = packages.find((item) => item.id === 'bridal-elora')

const bridalSteps = [
  {
    number: '01',
    title: 'Consultation & skin plan',
    text: 'A private conversation, colour study and a considered plan for your skin in the weeks before.',
  },
  {
    number: '02',
    title: 'The trial',
    text: 'A full look rehearsal — makeup, hair and draping — held in the calm of the studio.',
  },
  {
    number: '03',
    title: 'Your wedding morning',
    text: 'An unhurried ritual with a final mirror moment, touch-up kit and an artist close by.',
  },
]

export function Bridal({ onSelectService }: BridalProps) {
  return (
    <section
      className="section bridal"
      id="bridal"
      aria-labelledby="bridal-title"
    >
      <div className="bridal-contour" aria-hidden="true" />
      <BloomMark className="bridal-bloom" />

      <div className="container">
        <div className="bridal-grid">
          <Reveal className="bridal-copy">
            <SectionHeading
              eyebrow="The bridal atelier"
              headingId="bridal-title"
              tone="dark"
              title={
                <>
                  For the bride
                  <br />
                  who wants to feel
                  <br />
                  entirely <em>herself.</em>
                </>
              }
              intro={
                <p>
                  Only more luminous. Our bridal experience is designed around
                  your features, your heritage and the way you want to remember
                  the morning — never a template, always a portrait.
                </p>
              }
            />

            <ol className="bridal-steps" aria-label="The bridal experience">
              {bridalSteps.map((step) => (
                <li key={step.number}>
                  <span className="bridal-steps__number" aria-hidden="true">
                    {step.number}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <div className="bridal-actions">
              <a
                className="button button--light"
                href="#appointment"
                onClick={() => onSelectService('The Bridal Élora')}
              >
                <span>Begin your bridal journey</span>
                <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
              </a>
              <p>
                Sample bridal calendar · Limited dates imagined for this concept
              </p>
            </div>
          </Reveal>

          <Reveal className="bridal-visual" delay={140}>
            <div className="bridal-visual__main">
              <img
                src="/images/bridal-vermilion.webp"
                alt="Bride seated in an ornate red and gold lehenga against a golden backdrop"
                width="1067"
                height="1600"
                loading="lazy"
                decoding="async"
              />
              <div className="bridal-visual__shade" aria-hidden="true" />
              <span className="bridal-visual__caption">
                The bridal portrait
                <span>Rose · vermilion · heirloom gold</span>
              </span>
            </div>

            <div className="bridal-visual__inset">
              <img
                src="/images/bridal-closeup.webp"
                alt="Close-up of a bride in a red and gold veil with layered kundan jewellery"
                width="1067"
                height="1600"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="bridal-price">
              <span className="bridal-price__label">The signature</span>
              <p>The Bridal Élora</p>
              <span className="bridal-price__amount">
                From {formatInr(bridalPackage?.price ?? 24500)}
              </span>
              <span className="bridal-price__note">Sample package</span>
            </div>

            <span className="bridal-script" aria-hidden="true">
              timeless
            </span>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
