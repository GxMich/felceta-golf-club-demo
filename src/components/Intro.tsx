import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { finishIntro } from '../lib/intro'
import { Crest } from './Shared'

/* About one second, only when a visitor arrives from outside the demo: the mark is drawn, the name rises, the curtain
   lifts onto the hero. Reloads, history navigation and internal arrivals skip it; any click, key or scroll ends it at once. */
function freshArrival() {
  const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  if (navigation && navigation.type !== 'navigate') return false
  try { return !document.referrer || new URL(document.referrer).origin !== location.origin } catch { return true }
}

export default function Intro() {
  const root = useRef<HTMLDivElement>(null)
  const [gone, setGone] = useState(false)
  useLayoutEffect(() => {
    const element = root.current
    if (!element || window.matchMedia('(prefers-reduced-motion: reduce)').matches || !freshArrival()) {
      finishIntro()
      setGone(true)
      return
    }
    const events = ['pointerdown', 'keydown', 'wheel', 'touchstart'] as const
    const context = gsap.context(() => {
      const timeline = gsap.timeline({ onComplete: () => setGone(true) })
        .fromTo('.intro__mark', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: .6, ease: 'power2.out' }, 0)
        .from('.intro__name span', { yPercent: 110, duration: .6, stagger: .03, ease: 'expo.out' }, .1)
        .from('.intro__sub', { opacity: 0, duration: .4 }, .3)
        .to(element, { clipPath: 'inset(0% 0% 100% 0%)', duration: .55, ease: 'expo.inOut' }, .75)
        .add(finishIntro, .8)
      const skip = () => {
        events.forEach(name => window.removeEventListener(name, skip))
        finishIntro()
        timeline.kill()
        setGone(true)
      }
      events.forEach(name => window.addEventListener(name, skip, { passive: true }))
      return () => events.forEach(name => window.removeEventListener(name, skip))
    }, element)
    return () => context.revert()
  }, [])
  if (gone) return null
  return <div className="intro" ref={root} aria-hidden="true"><div className="intro__inner"><Crest className="intro__mark" /><p className="intro__name">{'Felceta'.split('').map((letter, index) => <span key={index}>{letter}</span>)}</p><p className="intro__sub">Golf & Country Club · Colle Albero</p></div></div>
}
