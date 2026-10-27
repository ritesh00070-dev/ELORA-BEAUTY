import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-500.css'
import '@fontsource/cormorant-garamond/latin-600.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import '@fontsource/cormorant-garamond/latin-500-italic.css'
import '@fontsource/jost/latin-300.css'
import '@fontsource/jost/latin-400.css'
import '@fontsource/jost/latin-500.css'
import './styles/base.css'
import './styles/header-hero.css'
import './styles/sections.css'
import './styles/gallery.css'
import './styles/pricing-testimonials.css'
import './styles/contact-footer.css'
import './styles/responsive.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
