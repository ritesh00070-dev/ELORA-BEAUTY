import type { CSSProperties } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { BloomMark } from './BloomMark'

export function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-orbit hero-orbit--one" aria-hidden="true" />
      <div className="hero-orbit hero-orbit--two" aria-hidden="true" />
      <BloomMark className="hero-bloom" />

      <div className="container hero-inner">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="hero-kicker__line" aria-hidden="true" />
            Hyderabad · By appointment
          </p>

          <h1 className="hero-title" id="hero-title">
            <span className="hero-title__line">
              <span style={{ '--line-delay': '120ms' } as CSSProperties}>
                Where beauty
              </span>
            </span>
            <span className="hero-title__line">
              <span style={{ '--line-delay': '260ms' } as CSSProperties}>
                becomes a
              </span>
            </span>
            <span className="hero-title__line">
              <span
                className="hero-title__accent"
                style={{ '--line-delay': '400ms' } as CSSProperties}
              >
                ritual.
              </span>
            </span>
          </h1>

          <p className="hero-lede">
            A quiet-luxury atelier for brides and women who savour the slower
            art of getting ready. Makeup, skin, hair and hands — composed
            around you, never over you.
          </p>

          <div className="hero-actions">
            <a className="button" href="#appointment">
              <span>Reserve your ritual</span>
              <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
            </a>
            <a className="text-link" href="#services">
              Explore the ritual menu
              <span className="text-link__rule" aria-hidden="true" />
            </a>
          </div>

          <div className="hero-details" role="group" aria-label="Studio highlights">
            <span>Skin-first artistry</span>
            <span className="hero-details__dot" aria-hidden="true">
              ✦
            </span>
            <span>Private appointments</span>
            <span className="hero-details__dot" aria-hidden="true">
              ✦
            </span>
            <span>Bridal specialists</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-shell">
            <div className="hero-image-frame">
              <img
                src="/images/hero-bride-1400.webp"
                srcSet="/images/hero-bride-900.webp 900w, /images/hero-bride-1400.webp 1400w"
                sizes="(max-width: 960px) 92vw, 44vw"
                width="1400"
                height="2100"
                alt="Bride in a rose-pink and gold lehenga with traditional jewellery, adjusting her veil"
                fetchPriority="high"
                decoding="async"
              />
              <div className="hero-image-vignette" aria-hidden="true" />
              <div className="hero-image-caption">
                <span className="hero-image-caption__label">The bridal edit</span>
                <span className="hero-image-caption__title">
                  Rose, heirloom gold
                  <br />& a quiet glow
                </span>
              </div>
            </div>

            <div className="hero-seal" aria-hidden="true">
              <svg viewBox="0 0 120 120" className="hero-seal__ring">
                <defs>
                  <path
                    id="seal-circle"
                    d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"
                  />
                </defs>
                <text>
                  <textPath href="#seal-circle" startOffset="0">
                    ÉLORA · BEAUTY STUDIO · HYDERABAD ·
                  </textPath>
                </text>
              </svg>
              <span className="hero-seal__centre">É</span>
            </div>

            <span className="hero-vertical-note" aria-hidden="true">
              Bridal artistry · Est. 2016
            </span>
          </div>
          <span className="hero-script" aria-hidden="true">
            lumière
          </span>
        </div>
      </div>

      <a className="scroll-cue" href="#atelier">
        <span>Discover Élora</span>
        <span className="scroll-cue__line" aria-hidden="true" />
        <ArrowDown size={15} strokeWidth={1.3} aria-hidden="true" />
      </a>
    </section>
  )
}
