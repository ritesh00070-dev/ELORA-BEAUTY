export type Service = {
  id: string
  name: string
  description: string
  price: number
  duration: string
  image: string
  imageAlt: string
  imagePosition: string
}

export type Package = {
  id: string
  name: string
  summary: string
  price: number
  duration: string
  includes: string[]
  featured?: boolean
}

export type GalleryCategory =
  | 'All'
  | 'Bridal'
  | 'Makeup'
  | 'Skin'
  | 'Hair'
  | 'Details'

export type GalleryImage = {
  id: string
  src: string
  alt: string
  title: string
  category: Exclude<GalleryCategory, 'All'>
  note: string
  orientation: 'portrait' | 'landscape' | 'square'
}

export type Testimonial = {
  id: string
  quote: string
  name: string
  context: string
}

export const formatInr = (value: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)

export const services: Service[] = [
  {
    id: 'bridal-artistry',
    name: 'Bridal Artistry',
    description:
      'A considered bridal design from first consultation to the final touch-up — built to feel like you, only more luminous.',
    price: 24500,
    duration: 'Trial + wedding day',
    image: '/images/bridal-touch.webp',
    imageAlt:
      'Hands gently adjusting the veil of a smiling bride in red and gold',
    imagePosition: '50% 28%',
  },
  {
    id: 'occasion-makeup',
    name: 'Occasion Makeup',
    description:
      'Soft-focus, long-wear makeup for engagements, receptions and every celebration in between.',
    price: 4500,
    duration: '90–120 minutes',
    image: '/images/makeup-artistry.webp',
    imageAlt:
      'Makeup artist applying a rose-toned lip colour with a fine brush',
    imagePosition: '62% 30%',
  },
  {
    id: 'skin-rituals',
    name: 'Skin Rituals',
    description:
      'Bespoke facials, dewy prep and pre-bridal glow journeys shaped around your skin, not a set menu.',
    price: 2800,
    duration: '60–90 minutes',
    image: '/images/facial-ritual.webp',
    imageAlt:
      'A guest resting during a rose clay facial treatment in a warm studio',
    imagePosition: '50% 35%',
  },
  {
    id: 'hair-couture',
    name: 'Hair Couture',
    description:
      'Loose waves, sculpted updos and bridal hair designed to hold beautifully from first look to last dance.',
    price: 2500,
    duration: '45–90 minutes',
    image: '/images/hair-soft.webp',
    imageAlt:
      'Woman with soft, loose curls viewed from behind against a blush wall',
    imagePosition: '50% 25%',
  },
  {
    id: 'hands-nails',
    name: 'Hands & Nails',
    description:
      'Meticulous manicures, pedicures and considered bridal nail art in a calm, private setting.',
    price: 1200,
    duration: '45–75 minutes',
    image: '/images/hands-adorned.webp',
    imageAlt:
      'Close-up of elegant manicured hands with delicate rings against dark fabric',
    imagePosition: '50% 42%',
  },
  {
    id: 'saree-styling',
    name: 'Saree & Dupatta Styling',
    description:
      'Precise, photograph-ready draping that finishes the look and keeps every pleat in its place.',
    price: 1500,
    duration: '30–45 minutes',
    image: '/images/bridal-vermilion.webp',
    imageAlt:
      'Bride seated in an ornate red and gold lehenga against a golden backdrop',
    imagePosition: '50% 28%',
  },
]

export const packages: Package[] = [
  {
    id: 'occasion-edit',
    name: 'The Occasion Edit',
    summary:
      'For the celebrations that call for a little more polish and a lot more staying power.',
    price: 7500,
    duration: 'Up to 3 hours',
    includes: [
      'Occasion makeup design',
      'Hair styling of choice',
      'Strip lashes & touch-up mist',
      'Private studio appointment',
    ],
  },
  {
    id: 'bridal-elora',
    name: 'The Bridal Élora',
    summary:
      'Our signature bridal experience, held across a trial and your wedding morning.',
    price: 24500,
    duration: 'Trial + wedding day',
    includes: [
      'Bridal consultation & trial',
      'Skin-first preparation ritual',
      'Bridal makeup & hair styling',
      'Saree or dupatta styling',
      'Wedding-day touch-up kit',
      'Artist with you until departure',
    ],
    featured: true,
  },
  {
    id: 'bridal-week',
    name: 'The Bridal Week',
    summary:
      'A considered edit of looks for every chapter of the wedding week, designed as one story.',
    price: 38500,
    duration: 'Trial + 2 event days',
    includes: [
      'Everything in The Bridal Élora',
      'One additional event look',
      'Coordinated hair & makeup changes',
      'Bridal nail ritual',
      'Priority wedding-week scheduling',
    ],
  },
]

export const galleryImages: GalleryImage[] = [
  {
    id: 'maharani',
    src: '/images/bridal-maharani.webp',
    alt: 'Indian bride in a red and gold lehenga with a regal crown and kundan jewellery',
    title: 'The Maharani Edit',
    category: 'Bridal',
    note: 'Bridal · heirloom gold',
    orientation: 'portrait',
  },
  {
    id: 'closeup',
    src: '/images/bridal-closeup.webp',
    alt: 'Close-up portrait of a bride in a red and gold veil and statement gold necklace',
    title: 'A Study in Vermilion',
    category: 'Bridal',
    note: 'Bridal · rose & gold',
    orientation: 'portrait',
  },
  {
    id: 'finishing-stroke',
    src: '/images/makeup-artistry.webp',
    alt: 'Makeup artist applying a soft rose lip colour to a model',
    title: 'The Finishing Stroke',
    category: 'Makeup',
    note: 'Artistry · rose lip',
    orientation: 'landscape',
  },
  {
    id: 'objects',
    src: '/images/details-flatlay.webp',
    alt: 'Rose-gold makeup brushes, blush compacts and a velvet scrunchie arranged on ivory',
    title: 'Objects of Ritual',
    category: 'Details',
    note: 'Still life · rose gold',
    orientation: 'square',
  },
  {
    id: 'softly-undone',
    src: '/images/hair-soft.webp',
    alt: 'Woman with soft, undone curls seen from behind against a dusty pink wall',
    title: 'Softly Undone',
    category: 'Hair',
    note: 'Hair · morning light',
    orientation: 'landscape',
  },
  {
    id: 'adorned-hands',
    src: '/images/hands-adorned.webp',
    alt: 'Elegantly manicured hands with gold rings resting against dark fabric',
    title: 'Hands, Adorned',
    category: 'Details',
    note: 'Nails · quiet luxury',
    orientation: 'portrait',
  },
  {
    id: 'rose-clay',
    src: '/images/facial-ritual.webp',
    alt: 'Guest relaxing with a rose clay facial mask being applied by brush',
    title: 'The Rose Clay Ritual',
    category: 'Skin',
    note: 'Skin · slow beauty',
    orientation: 'landscape',
  },
  {
    id: 'calm-before',
    src: '/images/skin-calm.webp',
    alt: 'Skincare products, a soft towel and pink tulips in a minimal spa setting',
    title: 'The Calm Before',
    category: 'Skin',
    note: 'Skin · pre-bridal calm',
    orientation: 'square',
  },
]

export const galleryCategories: GalleryCategory[] = [
  'All',
  'Bridal',
  'Makeup',
  'Skin',
  'Hair',
  'Details',
]

export const testimonials: Testimonial[] = [
  {
    id: 'ananya',
    quote:
      'I wanted to look like myself, only lit from within. Élora understood that before I could explain it. The trial felt like a conversation, and on the wedding morning I felt impossibly calm.',
    name: 'Ananya R.',
    context: 'Bride · winter wedding',
  },
  {
    id: 'ishita',
    quote:
      'The studio is the opposite of a rushed salon experience. Every detail had intention — the skin prep, the scent, the tea, the way my hair was pinned. I left feeling completely looked after.',
    name: 'Ishita M.',
    context: 'Reception makeup & hair',
  },
  {
    id: 'saanvi',
    quote:
      'My mother cried when she saw me. Not because the makeup changed me, but because it looked like a more luminous version of the face she knew. That is the real luxury.',
    name: 'Saanvi K.',
    context: 'The Bridal Élora experience',
  },
]

export const addOns = [
  { name: 'Standalone bridal trial', price: 6000 },
  { name: 'Additional event look', price: 8500 },
  { name: 'Strip lashes', price: 800 },
  { name: 'On-location travel', price: 3500, from: true },
]
