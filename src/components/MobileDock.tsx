import { useEffect, useState } from 'react'
import { Phone } from 'lucide-react'
import { contact, roomsUrl, teeTimeUrl } from '../data/site'
import { useSite } from '../lib/site'
import { Arrow, SiteLink } from './Shared'

/* Phones only: a call button and the page's main action, shown once the hero has scrolled away and hidden over the footer. */
export default function MobileDock() {
  const { text, url, path } = useSite()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    let footerInView = false
    const footer = document.querySelector('.site-footer')
    const update = () => setVisible(window.scrollY > window.innerHeight * .6 && !footerInView)
    const observer = new IntersectionObserver(([entry]) => { footerInView = entry.isIntersecting; update() })
    if (footer) observer.observe(footer)
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => { observer.disconnect(); window.removeEventListener('scroll', update) }
  }, [path])
  if (path === '/richiesta') return null
  const action = path === '/ospitalita' ? { label: text('Chiedi disponibilità', 'Ask for availability'), href: roomsUrl() }
    : path === '/' || path.startsWith('/golf/') ? { label: text('Chiedi un tee time', 'Request a tee time'), href: teeTimeUrl() }
    : path === '/eventi' ? { label: text('Racconta il tuo evento', 'Tell us about your event'), href: '/richiesta?intent=event' }
    : path === '/membership' ? { label: text('Diventa socio', 'Become a member'), href: '/richiesta?intent=membership' }
    : { label: text('Organizza la visita', 'Plan your visit'), href: '/richiesta' }
  return <div className={`mobile-dock${visible ? ' is-visible' : ''}`}>
    <a className="mobile-dock__call" href={contact.phoneHref} aria-label={text('Chiama il circolo', 'Call the club')}><Phone size={18} strokeWidth={1.3} aria-hidden="true" /></a>
    <SiteLink className="mobile-dock__action" href={url(action.href)}>{action.label}<Arrow /></SiteLink>
  </div>
}
