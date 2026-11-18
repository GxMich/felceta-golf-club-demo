import type { ReactNode } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import imageData from '../data/images.json'
import { asset, useSite } from '../lib/site'

export function Arrow({ direction = 'right' }: { direction?: 'right' | 'up' | 'down' }) {
  const Icon = direction === 'up' ? ArrowUpRight : direction === 'down' ? ArrowDown : ArrowRight
  return <Icon size={16} strokeWidth={1.25} aria-hidden="true" />
}

export function SiteLink({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return /^(https?:|mailto:|tel:|#)/.test(href) ? <a href={href} {...props}>{children}</a> : <Link to={href} {...props}>{children}</Link>
}

/* A link outside the demo: new tab, said aloud, marked with an arrow. */
export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  const { text } = useSite()
  return <a href={href} className={className} target="_blank" rel="noopener noreferrer">{children}<span className="visually-hidden"> {text('(si apre in una nuova scheda)', '(opens in a new tab)')}</span><Arrow direction="up" /></a>
}

export function TextLink({ href, children, light = false }: { href: string; children: ReactNode; light?: boolean }) {
  return <SiteLink className={`text-link${light ? ' text-link--light' : ''}`} href={href}>{children}</SiteLink>
}

export function Photo({ name, alt, className = '', priority = false, sizes = '(max-width: 700px) 100vw, 50vw' }: { name: string; alt: string; className?: string; priority?: boolean; sizes?: string }) {
  const variants = imageData[name as keyof typeof imageData]
  const fallback = variants.find(item => item.width >= 1200) || variants[variants.length - 1]
  return <img className={className} src={asset(fallback.src)} srcSet={variants.map(item => `${asset(item.src)} ${item.width}w`).join(', ')} sizes={sizes} alt={alt} width={fallback.width} height={fallback.height} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" />
}

/* The demo's own mark: a fern frond inside a ring, drawn in currentColor. */
export function Crest({ className = '' }: { className?: string; variant?: 'line' | 'colour' }) {
  return <svg className={`crest ${className}`} viewBox="0 0 120 128" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <circle cx="60" cy="62" r="52" />
    <circle cx="60" cy="62" r="45" strokeWidth="1" />
    <path d="M60 100 C60 78 60 50 60 24" />
    {[30, 38, 46, 54, 62, 70, 78, 86].map((y, index) => {
      const reach = 8 + Math.min(index, 7 - index + 3) * 3.2
      return <g key={y}><path d={`M60 ${y + 4} C${60 - reach * .5} ${y} ${60 - reach} ${y - 2} ${60 - reach - 2} ${y - 7}`} /><path d={`M60 ${y + 4} C${60 + reach * .5} ${y} ${60 + reach} ${y - 2} ${60 + reach + 2} ${y - 7}`} /></g>
    })}
    <path d="M40 118 H80" strokeWidth="1.4" />
  </svg>
}

export function Wordmark() {
  return <span className="wordmark"><span className="wordmark__crest"><Crest /></span><span className="wordmark__text"><span>Felceta</span>{' '}<small>Golf & Country Club</small></span></span>
}

/* Splits a heading on line breaks and renders *text* in italics. Italics are kept for the few signature headings. */
export function Lines({ text }: { text: string }) {
  return <>{text.split('\n').map((line, index) => <span className="line" key={index}><span>{line.split(/(\*[^*]+\*)/).map((part, key) => part.startsWith('*') ? <em key={key}>{part.slice(1, -1)}</em> : part)}</span>{' '}</span>)}</>
}
