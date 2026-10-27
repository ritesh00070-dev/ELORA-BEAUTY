import { ArrowUp, ArrowUpRight, Mail, MapPin, Phone } from 'lucide-react'
import { navItems, siteConfig } from '../config/site'
import { services } from '../data/content'
import { Logo } from './Logo'

function InstagramGlyph() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.4" cy="6.6" r="0.7" fill="currentColor" stroke="none" />
    </svg>
  )
}

type FooterProps = {
  onSelectService: (serviceName: string) => void
}

export function Footer({ onSelectService }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-cta">
          <div>
            <p className="eyebrow">The next quiet moment</p>
            <h2>Let’s make your mirror moment.</h2>
          </div>
          <a className="button button--light" href="#appointment">
            <span>Begin an enquiry</span>
            <ArrowUpRight size={17} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>

        <div className="footer-grid">
          <div className="footer-brand">
            <Logo light />
            <p>
              A fictional quiet-luxury beauty and bridal atelier, composed
              around softness, skin-first artistry and the ritual of getting
              ready.
            </p>
            <a
              className="footer-social"
              href={siteConfig.social.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram — demo link, opens in a new tab"
            >
              <InstagramGlyph />
              <span>Instagram</span>
            </a>
          </div>

          <nav className="footer-nav" aria-label="Footer navigation">
            <h3>Explore</h3>
            {navItems.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <nav className="footer-nav" aria-label="Footer services">
            <h3>Rituals</h3>
            {services.slice(0, 5).map((service) => (
              <a
                key={service.id}
                href="#appointment"
                onClick={() => onSelectService(service.name)}
              >
                {service.name}
              </a>
            ))}
          </nav>

          <div className="footer-contact">
            <h3>Visit</h3>
            <address>
              <MapPin size={15} strokeWidth={1.4} aria-hidden="true" />
              <span>
                {siteConfig.contact.address.line1}
                <br />
                {siteConfig.contact.address.line2},{' '}
                {siteConfig.contact.address.city}
                <br />
                {siteConfig.contact.address.region}
              </span>
            </address>
            <a href={siteConfig.contact.phoneHref}>
              <Phone size={15} strokeWidth={1.4} aria-hidden="true" />
              <span>{siteConfig.contact.phone}</span>
            </a>
            <a href={siteConfig.contact.emailHref}>
              <Mail size={15} strokeWidth={1.4} aria-hidden="true" />
              <span>{siteConfig.contact.email}</span>
            </a>
            <p className="footer-hours">
              {siteConfig.contact.hours[0].days}
              <br />
              {siteConfig.contact.hours[0].time}
            </p>
          </div>
        </div>

        <div className="footer-disclaimer">
          <span className="footer-disclaimer__label">
            A fictional concept
          </span>
          <p>{siteConfig.demo.disclaimer}</p>
          <a
            href="https://unsplash.com/license"
            target="_blank"
            rel="noopener noreferrer"
          >
            Photography licence
            <ArrowUpRight size={13} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>

        <div className="footer-bottom">
          <p>
            © {currentYear} {siteConfig.fullName} concept. All illustrative
            rights reserved.
          </p>
          <a className="footer-back-top" href="#home">
            <span>Back to top</span>
            <ArrowUp size={15} strokeWidth={1.4} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="footer-wordmark" aria-hidden="true">
        ÉLORA
      </div>
    </footer>
  )
}
