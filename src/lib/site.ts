import { useLocation } from 'react-router-dom'

export type Language = 'it' | 'en'
export type Translation = { it: string; en: string }
export const tr = (it: string, en: string): Translation => ({ it, en })
export const languages: readonly Language[] = ['it', 'en']

const prefix = /^\/(en)(?=\/|$)/
const locales = { it: 'it-IT', en: 'en-GB' } as const

export function useSite() {
  const location = useLocation()
  const language = (location.pathname.match(prefix)?.[1] || 'it') as Language
  const path = location.pathname.replace(prefix, '') || '/'
  const text = (it: string, en: string) => language === 'it' ? it : en
  const read = (value: Translation) => value[language]
  const url = (target: string, to: Language = language) => to === 'it' ? target : `/${to}${target === '/' ? '' : target}`
  const switchTo = (to: Language) => `${url(path, to)}${location.search}${location.hash}`
  return { language, path, text, read, url, switchTo, locale: locales[language] }
}

/* Files in public/ are served under the GitHub Pages base path. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
