import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { buildWhatsAppUrl, siteConfig } from '../config/site'

export function WhatsAppFab() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.65)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!visible) return null

  return (
    <a
      className="whatsapp-fab"
      href={buildWhatsAppUrl(siteConfig.whatsapp.directMessage)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message Élora Beauty Studio on WhatsApp (demo link)"
    >
      <span className="whatsapp-fab__icon" aria-hidden="true">
        <MessageCircle size={19} strokeWidth={1.6} />
      </span>
      <span className="whatsapp-fab__text">
        WhatsApp
        <small>Demo enquiry</small>
      </span>
    </a>
  )
}
