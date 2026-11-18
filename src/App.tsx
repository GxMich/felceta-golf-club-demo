import { useLayoutEffect, useRef } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './components/Home'
import { Footer } from './components/Layout'
import { CoursePage, EventsPage, MembershipPage, NotFound, StayPage } from './components/Pages'
import Enquiry from './components/Enquiry'
import Motion from './components/Motion'
import Intro from './components/Intro'
import MobileDock from './components/MobileDock'
import { useSite } from './lib/site'

function Site() {
  const location = useLocation()
  const { language, path, text } = useSite()
  const initial = useRef(true)
  useLayoutEffect(() => {
    document.documentElement.lang = language
    const titles: Record<string, string> = {
      '/': text('Golf, ospitalità e colline', 'Golf, hospitality and hills'),
      '/ospitalita': text('Camere e soggiorni', 'Rooms and stays'),
      '/eventi': text('Eventi e gruppi', 'Events and groups'),
      '/membership': 'Membership',
      '/richiesta': text('Organizza la visita', 'Plan your visit'),
      '/golf/il-bosco': 'Il Bosco',
      '/golf/i-canneti': 'I Canneti',
    }
    document.title = `${titles[path] || text('Pagina non trovata', 'Page not found')} | Felceta Golf & Country Club (demo)`
    const description = text('Felceta Golf & Country Club è un circolo di fantasia: sito dimostrativo con due percorsi, camere, eventi e membership.', 'Felceta Golf & Country Club is a fictional club: a demo website with two courses, rooms, events and membership.')
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', document.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    const frame = requestAnimationFrame(() => {
      if (location.hash) {
        const target = document.getElementById(location.hash.slice(1))
        target?.scrollIntoView({ behavior: 'instant' })
      } else {
        window.scrollTo({ top: 0, behavior: 'instant' })
        if (!initial.current) document.querySelector<HTMLElement>('main h1')?.focus({ preventScroll: true })
      }
      initial.current = false
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash, language, path, text])
  return <div id="top"><a href="#main" className="skip-link">{text('Vai al contenuto', 'Skip to content')}</a><Navigation /><main id="main" tabIndex={-1}><Routes>{['', '/en'].flatMap(prefix => [
    <Route path={prefix || '/'} element={<Home />} key={`${prefix}-home`} />,
    <Route path={`${prefix}/golf/:slug`} element={<CoursePage />} key={`${prefix}-golf`} />,
    <Route path={`${prefix}/ospitalita`} element={<StayPage />} key={`${prefix}-stay`} />,
    <Route path={`${prefix}/eventi`} element={<EventsPage />} key={`${prefix}-events`} />,
    <Route path={`${prefix}/membership`} element={<MembershipPage />} key={`${prefix}-membership`} />,
    <Route path={`${prefix}/richiesta`} element={<Enquiry key={location.search} />} key={`${prefix}-enquiry`} />,
  ])}<Route path="*" element={<NotFound />} /></Routes></main><Footer /><Motion key={`${location.pathname}${location.search}`} /><MobileDock /><Intro /></div>
}

/* GitHub Pages has no rewrites: 404.html keeps the requested address in ?p= and we restore it before the router starts. */
const restored = new URLSearchParams(window.location.search).get('p')
if (restored && restored.startsWith('/')) history.replaceState(null, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}${restored}`)

export default function App() {
  return <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, '')}><Site /></BrowserRouter>
}
