import { asset, useSite } from '../lib/site'
import { contact, teeTimeUrl } from '../data/site'
import { Arrow, Lines, Photo, Crest, SiteLink } from './Shared'

const heroAlts: Record<string, [string, string]> = {
  villa: ['Villa Felceta tra gli alberi', 'Villa Felceta among the trees'],
  clubhouse: ['Il salotto con il camino della Club House', 'The Club House lounge with its fireplace'],
  lake: ['Il lago e il fairway lungo il percorso', 'The lake and fairway along the course'],
}

export function PageHero({ image, title, description, children, className = '', alt: label }: { image: string; title: string; description: string; children?: React.ReactNode; className?: string; alt?: string }) {
  const { text } = useSite()
  const alt = label ?? (heroAlts[image] ? text(...heroAlts[image]) : text('Alberi, fairway e green della tenuta', 'Trees, fairways and greens on the estate'))
  return <section className={`page-hero ${className}`}><div className="page-hero__visual"><Photo name={image} alt={alt} className="hero__image" priority sizes="100vw" /></div><div className="page-width page-hero__content"><h1 tabIndex={-1}><Lines text={title} /></h1><div className="page-hero__lede"><p>{description}</p>{children}</div></div></section>
}

export function ContactBand() {
  const { text, url } = useSite()
  return <section className="contact-band"><div className="page-width"><Crest className="contact-band__mark" /><div><h2><Lines text={text('Una domanda\nprima di venire?', 'A question\nbefore you come?')} /></h2><p>{text('La segreteria risponde al ', 'The club office answers on ')}<a href={contact.phoneHref}>{contact.phone}</a>{text(': tutti i giorni dalle 8:30 alle 18:00, il lunedì fino alle 17:00.', ': every day from 8:30 to 18:00, Mondays until 17:00.')}</p></div><SiteLink href={url('/richiesta')} className="button button--ivory">{text('Organizza la visita', 'Plan your visit')}<Arrow /></SiteLink></div></section>
}

export function Footer() {
  const { text, url } = useSite()
  return <footer className="site-footer">
    <div className="page-width footer-top">
      <div className="footer-brand"><Crest /><p className="footer-brand__name">Felceta</p><p className="footer-brand__sub">Golf & Country Club · Colle Albero</p></div>
      <div className="footer-columns">
        <div><h2>{text('Visita', 'Visit')}</h2><address>{contact.address}<br />{contact.town}</address></div>
        <div><h2>{text('Contatti', 'Contact')}</h2><a className="footer-contact" href={contact.phoneHref}>{contact.phone}</a><a className="footer-email" href={`mailto:${contact.email}`}>{contact.email}</a><p className="footer-hours">{text('Segreteria: tutti i giorni 8:30–18:00, lunedì fino alle 17:00', 'Club office: daily 8:30–18:00, Mondays until 17:00')}</p></div>
        <nav aria-label={text('Navigazione a fondo pagina', 'Footer navigation')}><h2>{text('Esplora', 'Explore')}</h2><SiteLink href={url('/#golf')}>Golf</SiteLink><SiteLink href={url('/ospitalita')}>{text('Ospitalità', 'Stay')}</SiteLink><SiteLink href={url('/eventi')}>{text('Eventi', 'Events')}</SiteLink><SiteLink href={url('/membership')}>Membership</SiteLink><SiteLink href={url(teeTimeUrl())}>{text('Chiedi un tee time', 'Request a tee time')}</SiteLink></nav>
      </div>
    </div>
    <div className="footer-bottom page-width"><p lang="it">Attività di fantasia: nomi, recapiti, prezzi e recensioni sono inventati. Sito dimostrativo realizzato da <a href="https://www.modicamichele.it">Michele Modica</a>. <span lang={text('it', 'en')}>{text('Foto da Unsplash. Meteo: Open-Meteo.com (CC BY 4.0).', 'Fictional business, demo website. Photos from Unsplash. Weather: Open-Meteo.com (CC BY 4.0).')}</span></p><div><a href={asset('crediti-fotografici.html')}>{text('Crediti', 'Credits')}</a><a href="#top">{text('Torna su', 'Back to top')}</a></div></div>
  </footer>
}
