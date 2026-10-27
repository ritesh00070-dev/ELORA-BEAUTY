import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { formatInr, services } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type ServicesProps = {
  onSelectService: (serviceName: string) => void
}

export function Services({ onSelectService }: ServicesProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const activeService = services[activeIndex]

  return (
    <section
      className="section services"
      id="services"
      aria-labelledby="services-title"
    >
      <div className="container">
        <Reveal className="services-head">
          <SectionHeading
            eyebrow="The ritual menu"
            headingId="services-title"
            title={
              <>
                Curated for
                <br />
                the way you want
                <br />
                to <em>feel.</em>
              </>
            }
          />
          <div className="services-head__aside">
            <p>
              From a luminous hour before dinner to a full bridal morning, each
              service is shaped in consultation and finished with an artist’s
              eye.
            </p>
            <a className="text-link" href="#pricing">
              View the sample investment
              <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
            </a>
          </div>
        </Reveal>

        <div className="services-layout">
          <Reveal className="services-menu" delay={80}>
            <div className="services-menu__list">
              {services.map((service, index) => (
                <a
                  key={service.id}
                  className={`service-row ${
                    activeIndex === index ? 'is-active' : ''
                  }`.trim()}
                  href="#appointment"
                  onMouseEnter={() => setActiveIndex(index)}
                  onFocus={() => setActiveIndex(index)}
                  onClick={() => onSelectService(service.name)}
                >
                  <span className="service-row__index">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="service-row__content">
                    <span className="service-row__title">{service.name}</span>
                    <span className="service-row__description">
                      {service.description}
                    </span>
                    <span className="service-row__meta">
                      <span>From {formatInr(service.price)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{service.duration}</span>
                    </span>
                  </span>
                  <span className="service-row__arrow" aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={1.4} />
                  </span>
                </a>
              ))}
            </div>

            <p className="menu-note">
              Starting prices in INR · Sample menu only. Final pricing is
              confirmed after consultation, and travel is quoted separately.
            </p>
          </Reveal>

          <Reveal className="services-visual" delay={160}>
            <div className="services-preview">
              <div className="services-preview__frame">
                {services.map((service, index) => (
                  <img
                    key={service.id}
                    className={
                      index === activeIndex ? 'is-active' : undefined
                    }
                    src={service.image}
                    alt={index === activeIndex ? service.imageAlt : ''}
                    aria-hidden={index !== activeIndex}
                    style={{ objectPosition: service.imagePosition }}
                    loading="lazy"
                    decoding="async"
                    width="1067"
                    height="1600"
                  />
                ))}
                <div className="services-preview__shade" aria-hidden="true" />
                <div className="services-preview__caption">
                  <span>
                    {String(activeIndex + 1).padStart(2, '0')} /{' '}
                    {String(services.length).padStart(2, '0')}
                  </span>
                  <p>{activeService.name}</p>
                </div>
              </div>
              <div className="services-preview__note">
                <span className="services-preview__star" aria-hidden="true">
                  ✦
                </span>
                <p>
                  Every appointment begins with a conversation about comfort,
                  skin and the version of yourself you want to meet in the
                  mirror.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
