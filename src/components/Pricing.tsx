import { ArrowUpRight, Check } from 'lucide-react'
import {
  addOns,
  formatInr,
  packages,
  type Package,
} from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type PricingProps = {
  onSelectService: (serviceName: string) => void
}

function PackageCard({
  packageItem,
  index,
  onSelectService,
}: {
  packageItem: Package
  index: number
  onSelectService: (serviceName: string) => void
}) {
  return (
    <Reveal
      className={`price-card ${packageItem.featured ? 'price-card--featured' : ''}`.trim()}
      delay={index * 90}
    >
      <div className="price-card__top">
        <span className="price-card__index">
          {String(index + 1).padStart(2, '0')}
        </span>
        {packageItem.featured ? (
          <span className="price-card__badge">Signature</span>
        ) : (
          <span className="price-card__type">Package</span>
        )}
      </div>

      <h3>{packageItem.name}</h3>
      <p className="price-card__summary">{packageItem.summary}</p>

      <div className="price-card__price">
        <span>From</span>
        <strong>{formatInr(packageItem.price)}</strong>
        <small>{packageItem.duration}</small>
      </div>

      <ul className="price-card__includes">
        {packageItem.includes.map((item) => (
          <li key={item}>
            <Check size={14} strokeWidth={1.7} aria-hidden="true" />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <a
        className={`price-card__cta ${
          packageItem.featured ? 'price-card__cta--light' : ''
        }`.trim()}
        href="#appointment"
        onClick={() => onSelectService(packageItem.name)}
      >
        <span>Enquire about this package</span>
        <ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true" />
      </a>
    </Reveal>
  )
}

export function Pricing({ onSelectService }: PricingProps) {
  return (
    <section
      className="section pricing"
      id="pricing"
      aria-labelledby="pricing-title"
    >
      <div className="pricing-ornament" aria-hidden="true" />
      <div className="container">
        <Reveal className="pricing-head">
          <SectionHeading
            eyebrow="The investment"
            headingId="pricing-title"
            align="center"
            title={
              <>
                Transparent from the start.
                <br />
                Personal to the <em>last detail.</em>
              </>
            }
            intro={
              <p>
                A considered starting point for your celebration. Every Élora
                appointment is tailored after consultation, with a written quote
                before you commit.
              </p>
            }
          />
          <p className="sample-label">Sample pricing · INR</p>
        </Reveal>

        <div className="pricing-grid">
          {packages.map((packageItem, index) => (
            <PackageCard
              key={packageItem.id}
              packageItem={packageItem}
              index={index}
              onSelectService={onSelectService}
            />
          ))}
        </div>

        <Reveal className="pricing-extras">
          <div className="pricing-extras__intro">
            <p className="eyebrow">Little additions</p>
            <h3>For the final flourish.</h3>
          </div>
          <dl className="addon-list">
            {addOns.map((addOn) => (
              <div key={addOn.name}>
                <dt>{addOn.name}</dt>
                <dd>
                  {addOn.from ? 'From ' : ''}
                  {formatInr(addOn.price)}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <p className="pricing-note">
          Illustrative pricing for this concept only. Taxes are additional and
          on-location travel is quoted separately. No payment is collected on
          this demo website.
        </p>
      </div>
    </section>
  )
}
