import { ArrowUpRight } from 'lucide-react'
import { BloomMark } from './BloomMark'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

const principles = [
  {
    number: '01',
    title: 'Skin first',
    text: 'Hydration, prep and finish are treated with the same care as colour.',
  },
  {
    number: '02',
    title: 'Still unmistakably you',
    text: 'We define your features rather than redesign them.',
  },
  {
    number: '03',
    title: 'Unhurried by design',
    text: 'One guest at a time, with a quiet room and space to breathe.',
  },
]

export function About() {
  return (
    <section className="section atelier" id="atelier" aria-labelledby="atelier-title">
      <div className="container">
        <div className="atelier-grid">
          <Reveal className="atelier-media">
            <div className="atelier-media__main">
              <img
                src="/images/bridal-detail.webp"
                alt="Soft-focus bridal portrait with a rose-pink veil and heirloom gold jewellery"
                width="1067"
                height="1600"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="atelier-media__inset">
              <img
                src="/images/facial-ritual.webp"
                alt="Guest enjoying a slow rose clay facial ritual"
                width="1200"
                height="800"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="atelier-quote">
              <span className="atelier-quote__mark" aria-hidden="true">
                “
              </span>
              <p>
                The most beautiful look is one that still feels like{' '}
                <em>you.</em>
              </p>
              <span className="atelier-quote__label">The Élora approach</span>
            </div>

            <BloomMark className="atelier-bloom" />
          </Reveal>

          <Reveal className="atelier-copy" delay={120}>
            <SectionHeading
              eyebrow="The Élora world"
              headingId="atelier-title"
              title={
                <>
                  A softer kind of <em>luxury.</em>
                  <br />
                  A deeper kind of care.
                </>
              }
            />

            <div className="atelier-copy__body">
              <p>
                Élora was imagined as a refuge from the rush — a private beauty
                atelier where artistry is unhurried and every detail is
                considered around you. Soft light, warm hands, and a quiet room
                that feels entirely yours.
              </p>
              <p>
                We begin with your skin, your features, your story. The result
                is never a different face, only a more luminous version of the
                one you know.
              </p>
            </div>

            <ul className="principles" aria-label="The Élora approach">
              {principles.map((principle) => (
                <li key={principle.number}>
                  <span className="principles__number" aria-hidden="true">
                    {principle.number}
                  </span>
                  <div>
                    <h3>{principle.title}</h3>
                    <p>{principle.text}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="founder-note">
              <div>
                <span className="founder-note__signature">Meera Kapoor</span>
                <span className="founder-note__role">
                  Founder &amp; creative director · fictional
                </span>
              </div>
              <BloomMark className="founder-note__mark" />
            </div>

            <a className="text-link" href="#services">
              Discover the rituals
              <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
