import { useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Photo } from './Shared'

gsap.registerPlugin(useGSAP)

export default function CoursePhoto({ image, name }: { image: string; name: string }) {
  const root = useRef<HTMLDivElement>(null)
  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.golf-feature__image', { opacity: .4, scale: 1.04, duration: 1.1, ease: 'expo.out' })
    })
    return () => media.revert()
  }, { scope: root, dependencies: [image], revertOnUpdate: true })
  return <div ref={root}><Photo name={image} alt={`${name}, Felceta`} className="golf-feature__image" sizes="(max-width: 899px) 100vw, 62vw" /></div>
}
