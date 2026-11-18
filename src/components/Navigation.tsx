import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { contact, teeTimeUrl } from '../data/site'
import { languages, useSite } from '../lib/site'
import type { Language } from '../lib/site'
import { Photo, SiteLink, Wordmark } from './Shared'

const languageNames: Record<Language, string> = { it: 'Italiano', en: 'English' }
const switchLabels: Record<Language, string> = { it: 'Passa all’italiano', en: 'Switch to English' }

function LanguageSwitch({ className, onNavigate }: { className: string; onNavigate?: () => void }) {
  const { language, switchTo } = useSite()
  return <div className={className}>{languages.map(code => code === language ? <span key={code} aria-current="true"><span className="visually-hidden">{languageNames[code]}: </span>{code.toUpperCase()}</span> : <SiteLink key={code} href={switchTo(code)} lang={code} onClick={onNavigate} aria-label={`${code.toUpperCase()} — ${switchLabels[code]}`}>{code.toUpperCase()}</SiteLink>)}</div>
}

export default function Navigation() {
  const { text, url, path } = useSite()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const dialog = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLButtonElement>(null)
  const items = [
    { label: text('Il Golf', 'Golf'), href: '/#golf', active: path.startsWith('/golf/') },
    { label: text('Ospitalità', 'Stay'), href: '/ospitalita', active: path === '/ospitalita' },
    { label: text('Eventi', 'Events'), href: '/eventi', active: path === '/eventi' },
    { label: 'Membership', href: '/membership', active: path === '/membership' },
  ]
  useEffect(() => {
    let last = window.scrollY
    const update = () => {
      const y = window.scrollY
      setScrolled(y > 70)
      if (y <= 420 || y < last - 2) setHidden(false)
      else if (y > last + 2 && y - last < 240) setHidden(true)
      last = y
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])
  useEffect(() => { dialog.current?.close() }, [location.key])
  useEffect(() => {
    const media = window.matchMedia('(min-width: 1280px)')
    const close = () => { if (media.matches) dialog.current?.close() }
    media.addEventListener('change', close)
    return () => media.removeEventListener('change', close)
  }, [])
  useEffect(() => {
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  const closeMenu = () => dialog.current?.close()
  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
    const first = focusable[0], last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
  }
  const solid = scrolled || path === '/richiesta' || !['/', '/ospitalita', '/eventi', '/membership', '/golf/il-bosco', '/golf/i-canneti'].includes(path)
  return <>
    <header className={`site-header${solid ? ' is-solid' : ''}${scrolled ? ' is-scrolled' : ''}${hidden && !open ? ' is-hidden' : ''}`}>
      <nav className="desktop-nav" aria-label={text('Navigazione principale', 'Main navigation')}>{items.map(item => <SiteLink href={url(item.href)} key={item.href} aria-current={item.active ? 'page' : undefined}>{item.label}</SiteLink>)}</nav>
      <button className="menu-toggle" ref={opener} onClick={() => { dialog.current?.showModal(); setOpen(true) }} aria-expanded={open} aria-controls="mobile-menu" aria-label={text('Apri menu', 'Open menu')}><span className="menu-toggle__lines" aria-hidden="true"><span /><span /></span><span className="menu-toggle__label" aria-hidden="true">Menu</span></button>
      <SiteLink href={url('/')} className="brand-link"><Wordmark /><span className="visually-hidden"> — {text('homepage', 'home')}</span></SiteLink>
      <div className="header-actions"><LanguageSwitch className="language-switch" /><SiteLink href={url(teeTimeUrl())} className="header-contact">{text('Chiedi un tee time', 'Request a tee time')}</SiteLink></div>
    </header>
    <dialog ref={dialog} id="mobile-menu" className="mobile-menu" aria-labelledby="menu-title" onKeyDown={trapFocus} onClose={() => { setOpen(false); opener.current?.focus() }} onClick={event => { if (event.target === event.currentTarget) closeMenu() }}>
      <div className="mobile-menu__inner">
        {/* Mirrors the header: the close control sits exactly where the menu toggle was. */}
        <div className="mobile-menu__top"><button className="menu-close" autoFocus onClick={closeMenu} aria-label={text('Chiudi menu', 'Close menu')}><span className="menu-close__lines" aria-hidden="true"><span /><span /></span><span className="menu-close__label" aria-hidden="true">{text('Chiudi', 'Close')}</span></button><span id="menu-title" className="mobile-menu__brand"><Wordmark /></span><LanguageSwitch className="language-switch mobile-menu__languages" onNavigate={closeMenu} /></div>
        <nav aria-label={text('Navigazione mobile', 'Mobile navigation')}>{[...items, { label: text('Organizza la visita', 'Plan your visit'), href: '/richiesta', active: path === '/richiesta' }].map(item => <SiteLink href={url(item.href)} onClick={closeMenu} key={item.href} aria-current={item.active ? 'page' : undefined}>{item.label}</SiteLink>)}</nav>
        <div className="mobile-menu__bottom">
          <div className="mobile-menu__quick"><SiteLink href={url(teeTimeUrl())} onClick={closeMenu}>{text('Chiedi un tee time', 'Request a tee time')}</SiteLink></div>
          <p>{contact.address}, {contact.town}</p><a href={contact.phoneHref}>{contact.phone}</a>
          <small>{text('Attività di fantasia, sito dimostrativo.', 'Fictional business, demo website.')}</small>
        </div>
      </div>
      <div className="mobile-menu__visual" aria-hidden="true"><Photo name="villa-evening" alt="" sizes="40vw" /></div>
    </dialog>
  </>
}
