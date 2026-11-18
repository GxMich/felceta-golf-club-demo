import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { introDone } from '../lib/intro'

gsap.registerPlugin(ScrollTrigger)

/* One authored moment: the island green opens from the lake as the page scrolls. Everything else is visible from the
   start; the home photograph only settles once the opening lifts and drifts a little with the page. Nothing runs with reduced motion. */
export default function Motion() {
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const hero = document.querySelector('.lx-hero')
      if (hero) {
        const photo = hero.querySelectorAll('.hero__image')
        const settle = gsap.from(photo, { scale: 1.06, duration: 1.8, ease: 'power3.out', paused: true })
        introDone.then(() => settle.play())
        gsap.to(photo, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } })
      }

      const ring = document.querySelector('.lx-ring')
      if (ring) {
        gsap.timeline({ scrollTrigger: { trigger: ring, start: 'top 75%', end: 'center 45%', scrub: 1 } })
          .fromTo('.lx-ring__mask', { clipPath: 'ellipse(24% 20% at 50% 46%)' }, { clipPath: 'ellipse(80% 80% at 50% 50%)', ease: 'power2.inOut' }, 0)
          .fromTo('.lx-ring__mask img', { scale: 1.35 }, { scale: 1, ease: 'power2.inOut' }, 0)
      }

      const refresh = () => ScrollTrigger.refresh()
      window.addEventListener('load', refresh)
      document.fonts?.ready.then(refresh)
      return () => window.removeEventListener('load', refresh)
    })
    return () => media.revert()
  }, [])
  return null
}
