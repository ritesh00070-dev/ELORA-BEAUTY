import { useEffect, useState, type FormEvent } from 'react'
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from 'lucide-react'
import { buildWhatsAppUrl, siteConfig } from '../config/site'
import { packages, services } from '../data/content'
import { Reveal } from './Reveal'
import { SectionHeading } from './SectionHeading'

type FormState = {
  name: string
  phone: string
  email: string
  service: string
  date: string
  time: string
  notes: string
  consent: boolean
}

type FormErrors = Partial<Record<keyof FormState, string>>
type SubmissionStatus = 'idle' | 'error' | 'success'

type AppointmentProps = {
  selectedService: string
  selectionVersion: number
}

const initialFormState: FormState = {
  name: '',
  phone: '',
  email: '',
  service: '',
  date: '',
  time: '',
  notes: '',
  consent: false,
}

function getTodayIso() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function formatDateForMessage(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return value

  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(year, month - 1, day))
}

const serviceGroups = [
  {
    label: 'Signature packages',
    names: packages.map((packageItem) => packageItem.name),
  },
  {
    label: 'Beauty services',
    names: services.map((service) => service.name),
  },
]

export function Appointment({
  selectedService,
  selectionVersion,
}: AppointmentProps) {
  const [form, setForm] = useState<FormState>({
    ...initialFormState,
    service: selectedService,
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [status, setStatus] = useState<SubmissionStatus>('idle')
  const [whatsAppLink, setWhatsAppLink] = useState('')
  const today = getTodayIso()

  useEffect(() => {
    if (!selectedService || selectionVersion === 0) return

    setForm((current) => ({ ...current, service: selectedService }))
    setErrors((current) => {
      if (!current.service) return current
      const next = { ...current }
      delete next.service
      return next
    })
    setStatus('idle')
  }, [selectedService, selectionVersion])

  function updateField<K extends keyof FormState>(
    field: K,
    value: FormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }))
    setStatus('idle')

    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function validateForm() {
    const nextErrors: FormErrors = {}
    const phoneDigits = form.phone.replace(/\D/g, '')

    if (form.name.trim().length < 2) {
      nextErrors.name = 'Please share the name we should greet.'
    }

    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      nextErrors.phone = 'Please enter a valid phone number with 10–15 digits.'
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = 'Please check the email address entered.'
    }

    if (!form.service) {
      nextErrors.service = 'Please choose the ritual you are interested in.'
    }

    if (!form.date) {
      nextErrors.date = 'Please choose a preferred date.'
    } else if (form.date < today) {
      nextErrors.date = 'Please choose a date from today onward.'
    }

    if (!form.time) {
      nextErrors.time = 'Please choose a preferred time of day.'
    }

    if (!form.consent) {
      nextErrors.consent = 'Please acknowledge that this is a demo enquiry.'
    }

    return nextErrors
  }

  function buildEnquiryMessage() {
    const optionalLines = [
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      form.notes.trim() ? `Notes: ${form.notes.trim()}` : null,
    ].filter((line): line is string => line !== null)

    return [
      'Hello Élora Beauty Studio — I would love to enquire about an appointment.',
      '',
      `Service: ${form.service}`,
      `Preferred date: ${formatDateForMessage(form.date)}`,
      `Preferred time: ${form.time}`,
      `Name: ${form.name.trim()}`,
      `Phone: ${form.phone.trim()}`,
      ...optionalLines,
      '',
      'Sent from the fictional Élora concept website (demo).',
    ].join('\n')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateForm()
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setStatus('error')
      const firstError = Object.keys(nextErrors)[0]
      window.requestAnimationFrame(() => {
        document.getElementById(`field-${firstError}`)?.focus()
      })
      return
    }

    const url = buildWhatsAppUrl(buildEnquiryMessage())
    setWhatsAppLink(url)
    setStatus('success')

    const link = document.createElement('a')
    link.href = url
    link.target = '_blank'
    link.rel = 'noopener noreferrer'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    link.remove()

    window.requestAnimationFrame(() => {
      document.getElementById('form-feedback')?.focus()
    })
  }

  const directWhatsAppUrl = buildWhatsAppUrl(
    siteConfig.whatsapp.directMessage,
  )

  return (
    <section
      className="section contact"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="contact-wash" aria-hidden="true" />
      <div className="container">
        <Reveal className="contact-head">
          <SectionHeading
            eyebrow="Visit & enquire"
            headingId="contact-title"
            title={
              <>
                Your ritual begins
                <br />
                with a <em>conversation.</em>
              </>
            }
            intro={
              <p>
                Tell us a little about the moment you are preparing for. We
                will reply with availability, a tailored starting point and a
                quiet space to ask anything.
              </p>
            }
          />
          <div className="contact-head__note">
            <span aria-hidden="true">✦</span>
            <p>
              Bridal enquiries are best made{' '}
              <strong>6–8 weeks in advance</strong>. Sample note for this
              concept.
            </p>
          </div>
        </Reveal>

        <div className="appointment-shell">
          <Reveal className="studio-panel">
            <div className="studio-panel__image">
              <img
                src="/images/bridal-touch.webp"
                alt="Hands adjusting the veil of a smiling bride in red and gold"
                width="1067"
                height="1600"
                loading="lazy"
                decoding="async"
              />
              <div className="studio-panel__image-shade" aria-hidden="true" />
              <span className="studio-panel__image-note">
                A quiet room · A considered hand
              </span>
            </div>

            <div className="studio-panel__body">
              <p className="eyebrow">The private studio</p>
              <h2>Held just for you.</h2>
              <p className="studio-panel__intro">
                One guest at a time, a warm cup of tea, and nowhere else to be.
                This is the pace of Élora.
              </p>

              <ul className="studio-details">
                <li>
                  <MapPin size={18} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <span>Visit</span>
                    <address>
                      {siteConfig.contact.address.line1}
                      <br />
                      {siteConfig.contact.address.line2},{' '}
                      {siteConfig.contact.address.city}
                      <br />
                      {siteConfig.contact.address.region}
                    </address>
                    <a
                      className="studio-details__link"
                      href={siteConfig.contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open area map
                      <ArrowUpRight
                        size={13}
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                    </a>
                  </div>
                </li>
                <li>
                  <Phone size={18} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <span>Speak</span>
                    <a href={siteConfig.contact.phoneHref}>
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </li>
                <li>
                  <Mail size={18} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <span>Write</span>
                    <a href={siteConfig.contact.emailHref}>
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </li>
                <li>
                  <Clock size={18} strokeWidth={1.4} aria-hidden="true" />
                  <div>
                    <span>Hours</span>
                    {siteConfig.contact.hours.map((entry) => (
                      <p key={entry.days}>
                        {entry.days} · {entry.time}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              <a
                className="studio-whatsapp"
                href={directWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle
                  size={17}
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                Message us on WhatsApp
              </a>

              <p className="studio-panel__demo">
                Fictional studio · Address and contact details are illustrative.
              </p>
            </div>
          </Reveal>

          <Reveal className="appointment-form-panel" delay={120}>
            <div id="appointment">
              <div className="appointment-form-head">
                <p className="eyebrow">Appointment enquiry</p>
                <h2>Tell us about your occasion.</h2>
                <p>
                  Fields marked with an asterisk are required. Your enquiry will
                  open in WhatsApp with the details below prefilled.
                </p>
              </div>

              <form noValidate onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="field-name">
                      Full name <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      placeholder="Your name"
                      value={form.name}
                      onChange={(event) =>
                        updateField('name', event.target.value)
                      }
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={
                        errors.name ? 'error-name' : undefined
                      }
                      required
                    />
                    {errors.name ? (
                      <p className="field-error" id="error-name">
                        {errors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="field-phone">
                      Phone / WhatsApp <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-phone"
                      name="phone"
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="+91 00000 00000"
                      value={form.phone}
                      onChange={(event) =>
                        updateField('phone', event.target.value)
                      }
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={
                        errors.phone ? 'error-phone' : undefined
                      }
                      required
                    />
                    {errors.phone ? (
                      <p className="field-error" id="error-phone">
                        {errors.phone}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="field-email">Email</label>
                    <input
                      id="field-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(event) =>
                        updateField('email', event.target.value)
                      }
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={
                        errors.email ? 'error-email' : undefined
                      }
                    />
                    {errors.email ? (
                      <p className="field-error" id="error-email">
                        {errors.email}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="field-service">
                      Ritual of interest <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="field-service"
                        name="service"
                        value={form.service}
                        onChange={(event) =>
                          updateField('service', event.target.value)
                        }
                        aria-invalid={Boolean(errors.service)}
                        aria-describedby={
                          errors.service ? 'error-service' : undefined
                        }
                        required
                      >
                        <option value="">Select a ritual</option>
                        {serviceGroups.map((group) => (
                          <optgroup key={group.label} label={group.label}>
                            {group.names.map((name) => (
                              <option key={name} value={name}>
                                {name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    {errors.service ? (
                      <p className="field-error" id="error-service">
                        {errors.service}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="field-date">
                      Preferred date <span aria-hidden="true">*</span>
                    </label>
                    <input
                      id="field-date"
                      name="date"
                      type="date"
                      min={today}
                      value={form.date}
                      onChange={(event) =>
                        updateField('date', event.target.value)
                      }
                      aria-invalid={Boolean(errors.date)}
                      aria-describedby={errors.date ? 'error-date' : undefined}
                      required
                    />
                    {errors.date ? (
                      <p className="field-error" id="error-date">
                        {errors.date}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field">
                    <label htmlFor="field-time">
                      Preferred time <span aria-hidden="true">*</span>
                    </label>
                    <div className="select-wrap">
                      <select
                        id="field-time"
                        name="time"
                        value={form.time}
                        onChange={(event) =>
                          updateField('time', event.target.value)
                        }
                        aria-invalid={Boolean(errors.time)}
                        aria-describedby={
                          errors.time ? 'error-time' : undefined
                        }
                        required
                      >
                        <option value="">Select a time</option>
                        <option value="Morning (10 am – 1 pm)">
                          Morning · 10 am – 1 pm
                        </option>
                        <option value="Afternoon (1 – 5 pm)">
                          Afternoon · 1 – 5 pm
                        </option>
                        <option value="Evening (5 – 8 pm)">
                          Evening · 5 – 8 pm
                        </option>
                      </select>
                    </div>
                    {errors.time ? (
                      <p className="field-error" id="error-time">
                        {errors.time}
                      </p>
                    ) : null}
                  </div>

                  <div className="form-field form-field--full">
                    <label htmlFor="field-notes">A little more context</label>
                    <textarea
                      id="field-notes"
                      name="notes"
                      rows={4}
                      placeholder="The date, the venue, the feeling you are imagining…"
                      value={form.notes}
                      onChange={(event) =>
                        updateField('notes', event.target.value)
                      }
                    />
                  </div>
                </div>

                <div className="form-consent">
                  <input
                    id="field-consent"
                    name="consent"
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) =>
                      updateField('consent', event.target.checked)
                    }
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={
                      errors.consent ? 'error-consent' : undefined
                    }
                    required
                  />
                  <label htmlFor="field-consent">
                    I understand this is a fictional demo and that no
                    appointment will be created.
                    <span aria-hidden="true"> *</span>
                  </label>
                </div>
                {errors.consent ? (
                  <p className="field-error" id="error-consent">
                    {errors.consent}
                  </p>
                ) : null}

                <div className="form-submit-row">
                  <button className="button form-submit" type="submit">
                    <MessageCircle
                      size={17}
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <span>Send enquiry via WhatsApp</span>
                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.4}
                      aria-hidden="true"
                    />
                  </button>
                  <p>Opens WhatsApp with your details prefilled.</p>
                </div>

                <div
                  id="form-feedback"
                  className={`form-feedback ${
                    status !== 'idle' ? 'is-visible' : ''
                  }`.trim()}
                  role={status === 'error' ? 'alert' : 'status'}
                  aria-live="polite"
                  tabIndex={-1}
                >
                  {status === 'success' ? (
                    <>
                      <span className="form-feedback__icon" aria-hidden="true">
                        ✦
                      </span>
                      <div>
                        <strong>Your WhatsApp enquiry is ready.</strong>
                        <p>
                          WhatsApp should now be open in a new tab.{' '}
                          <a
                            href={whatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Open it again
                          </a>{' '}
                          if it did not appear.
                        </p>
                      </div>
                    </>
                  ) : null}
                  {status === 'error' ? (
                    <p>Please review the highlighted fields above.</p>
                  ) : null}
                </div>

                <p className="form-privacy">
                  Demo only · No booking is created and no personal information
                  is stored by this website. Your details are only placed in the
                  WhatsApp message you choose to send.
                </p>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
