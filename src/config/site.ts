const envValue = (value: string | undefined, fallback: string) =>
  value?.trim() || fallback

const whatsappNumber = envValue(
  import.meta.env.VITE_WHATSAPP_NUMBER,
  '919876543210',
).replace(/\D/g, '')

const phone = envValue(import.meta.env.VITE_PHONE, '+91 98765 43210')
const email = envValue(import.meta.env.VITE_EMAIL, 'hello@elora.example')
const instagramUrl = envValue(
  import.meta.env.VITE_INSTAGRAM_URL,
  'https://www.instagram.com/',
)

export const siteConfig = {
  name: 'Élora',
  fullName: 'Élora Beauty Studio',
  tagline: 'Where beauty becomes a ritual.',
  description:
    'A quiet-luxury bridal and beauty atelier for considered makeup, skin, hair and hand rituals.',
  url: 'https://elora-beauty-studio.example',
  demo: {
    label: 'A fictional atelier · Concept demo',
    shortNote: 'Concept demo · Fictional studio',
    disclaimer:
      'ÉLORA Beauty Studio is a fictional concept created for demonstration purposes. All names, stories, testimonials and prices are illustrative. No appointments are actually booked and no personal information is stored. Photography supplied by Unsplash.',
  },
  contact: {
    phone,
    phoneHref: `tel:${phone.replace(/[^\d+]/g, '')}`,
    email,
    emailHref: `mailto:${email}`,
    address: {
      line1: '12A, Road No. 8',
      line2: 'Jubilee Hills',
      city: 'Hyderabad',
      region: 'Telangana 500033',
      country: 'India',
    },
    fullAddress:
      '12A, Road No. 8, Jubilee Hills, Hyderabad, Telangana 500033',
    mapsUrl:
      'https://www.google.com/maps/search/?api=1&query=Jubilee+Hills+Hyderabad',
    hours: [
      { days: 'Tuesday – Sunday', time: '10:00 am – 8:00 pm' },
      { days: 'Monday', time: 'By request' },
    ],
    note: 'Private studio · By appointment only',
  },
  whatsapp: {
    number: whatsappNumber,
    display: phone,
    directMessage:
      'Hello Élora, I would love to know more about your beauty and bridal services.',
  },
  social: {
    instagramUrl,
    instagramLabel: 'Instagram · demo link',
  },
} as const

export const navItems = [
  { label: 'The Atelier', href: '#atelier' },
  { label: 'Services', href: '#services' },
  { label: 'Bridal', href: '#bridal' },
  { label: 'Lookbook', href: '#gallery' },
  { label: 'The Menu', href: '#pricing' },
  { label: 'Visit', href: '#contact' },
]

export const buildWhatsAppUrl = (message: string) =>
  `https://wa.me/${siteConfig.whatsapp.number}?text=${encodeURIComponent(message)}`
