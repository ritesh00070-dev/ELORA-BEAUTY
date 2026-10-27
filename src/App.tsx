import { useCallback, useState } from 'react'
import { About } from './components/About'
import { Appointment } from './components/Appointment'
import { Bridal } from './components/Bridal'
import { Footer } from './components/Footer'
import { Gallery } from './components/Gallery'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Pricing } from './components/Pricing'
import { Services } from './components/Services'
import { Testimonials } from './components/Testimonials'
import { WhatsAppFab } from './components/WhatsAppFab'

type ServiceSelection = {
  name: string
  version: number
}

export default function App() {
  const [serviceSelection, setServiceSelection] = useState<ServiceSelection>({
    name: '',
    version: 0,
  })

  const handleSelectService = useCallback((name: string) => {
    setServiceSelection((current) => ({
      name,
      version: current.version + 1,
    }))
  }, [])

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Marquee />
        <About />
        <Services onSelectService={handleSelectService} />
        <Bridal onSelectService={handleSelectService} />
        <Gallery />
        <Pricing onSelectService={handleSelectService} />
        <Testimonials />
        <Appointment
          selectedService={serviceSelection.name}
          selectionVersion={serviceSelection.version}
        />
      </main>
      <Footer onSelectService={handleSelectService} />
      <WhatsAppFab />
    </>
  )
}
