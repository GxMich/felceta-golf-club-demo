import { useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { courseHoles } from '../data/holes'
import type { Hole } from '../data/holes'
import { teeColors } from '../data/experience'
import { useSite } from '../lib/site'

gsap.registerPlugin(useGSAP)

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0)

type Point = [number, number]
const along = (p0: Point, c: Point, p2: Point, t: number): Point => [
  (1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t ** 2 * p2[0],
  (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t ** 2 * p2[1],
]
/* Unit normal of the curve at t, used to place hazards beside the line of play. */
const normal = (p0: Point, c: Point, p2: Point, t: number): Point => {
  const dx = 2 * (1 - t) * (c[0] - p0[0]) + 2 * t * (p2[0] - c[0])
  const dy = 2 * (1 - t) * (c[1] - p0[1]) + 2 * t * (p2[1] - c[1])
  const length = Math.hypot(dx, dy) || 1
  return [-dy / length, dx / length]
}
const offset = (point: Point, direction: Point, distance: number): Point => [point[0] + direction[0] * distance, point[1] + direction[1] * distance]
const line = (points: Point[]) => points.map(([x, y], index) => `${index ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')

/* A schematic yardage plan drawn from the hole data: tee, line of play, fairway, green, bunkers, water and trees. */
function HolePlan({ hole, label }: { hole: Hole; label: string }) {
  const { shape, par } = hole
  const short = par === 3
  const tee: Point = [270, short ? 790 : 840]
  const green: Point = short ? [270, 230] : shape.bend === 'right' ? [390, 165] : shape.bend === 'left' ? [150, 165] : [270, 150]
  const control: Point = short ? [270, 520] : shape.bend === 'right' ? [205, 300] : shape.bend === 'left' ? [335, 300] : [270, 500]
  const steps = (from: number, to: number, count: number) => Array.from({ length: count }, (_, index) => from + (to - from) * index / (count - 1))
  const fairway = steps(short ? .72 : .22, .93, 24).map(t => along(tee, control, green, t))
  const side = (name: 'left' | 'right', t: number, distance: number) => offset(along(tee, control, green, t), normal(tee, control, green, t), name === 'left' ? distance : -distance)
  const trees = (shape.trees === 'both' ? ['left', 'right'] as const : shape.trees ? [shape.trees] : []).flatMap(name => steps(.12, .9, 7).map((t, index) => ({ point: side(name, t, 150 + (index % 2) * 34), r: 26 + (index % 3) * 6 })))
  const greenBunkers = steps(0, 1, Math.min(shape.bunkers, 3)).map((_, index, list) => {
    const angle = (list.length === 1 ? -.7 : -1.6 + index * 3.2 / Math.max(list.length - 1, 1)) - Math.PI / 2
    return offset(green, [Math.cos(angle), -Math.sin(angle)], 78)
  })
  const fairwayBunkers = short ? [] : Array.from({ length: Math.max(0, shape.bunkers - 3) + (shape.bunkers > 1 ? 1 : 0) }, (_, index) => side(index % 2 ? 'left' : 'right', .5 + index * .08, 68))
  const water = shape.water
  const waterSide = (name: 'left' | 'right') => {
    const outer = steps(short ? .55 : .45, .98, 10).map(t => side(name, t, 120))
    const inner = steps(.98, short ? .55 : .45, 10).map(t => side(name, t, 72))
    return `${line([...outer, ...inner])} Z`
  }
  const cross = along(tee, control, green, short ? .5 : .55)
  const front = along(tee, control, green, short ? .74 : .84)
  const flag: Point = [green[0] + 8, green[1] - 6]
  return <svg className="hole-plan" viewBox="0 0 540 900" role="img" aria-label={label}>
    <rect width="540" height="900" fill="#e4e6d2" />
    {trees.map((tree, index) => <circle key={`t${index}`} cx={tree.point[0]} cy={tree.point[1]} r={tree.r} fill="#56705b" opacity=".38" />)}
    {water === 'around' ? <ellipse cx={green[0]} cy={green[1]} rx="138" ry="112" fill="#93b6ba" /> : null}
    {water === 'left' || water === 'right' ? <path d={waterSide(water)} fill="#93b6ba" /> : null}
    {water === 'cross' ? <rect x="40" y={cross[1] - 26} width="460" height="52" rx="26" fill="#93b6ba" /> : null}
    {water === 'front' ? <ellipse cx={front[0]} cy={front[1]} rx="105" ry="44" fill="#93b6ba" /> : null}
    {water === 'around' ? null : <path d={line(fairway)} stroke="#b4c79a" strokeWidth={short ? 70 : 108} strokeLinecap="round" strokeLinejoin="round" fill="none" />}
    {water === 'cross' ? <rect x="40" y={cross[1] - 26} width="460" height="52" rx="26" fill="#93b6ba" opacity=".92" /> : null}
    {[...greenBunkers, ...fairwayBunkers].map((point, index) => <ellipse key={`b${index}`} cx={point[0]} cy={point[1]} rx="30" ry="18" fill="#efe3c8" stroke="#cdb98d" strokeWidth="2" />)}
    <ellipse cx={green[0]} cy={green[1]} rx="58" ry="44" fill="#86ad72" stroke="#6f9660" strokeWidth="2" />
    <path d={line(Array.from({ length: 30 }, (_, index) => along(tee, control, green, index / 29)))} stroke="#7a5d2e" strokeWidth="2" strokeDasharray="3 9" strokeLinecap="round" fill="none" />
    <rect x={tee[0] - 34} y={tee[1] - 14} width="68" height="28" rx="4" fill="#b4c79a" stroke="#6f9660" strokeWidth="2" />
    <line x1={flag[0]} y1={flag[1]} x2={flag[0]} y2={flag[1] - 54} stroke="#13221d" strokeWidth="2.5" />
    <path d={`M${flag[0]} ${flag[1] - 54} l30 10 l-30 10 Z`} fill="#b04a2f" />
    <text x={tee[0] + 48} y={tee[1] + 6} fontFamily="Albert Sans, Arial, sans-serif" fontSize="22" fill="#13221d">{hole.lengths[0]} m</text>
    <text x="34" y="60" fontFamily="Cormorant Garamond, Georgia, serif" fontSize="44" fill="#7a5d2e">{hole.number}</text>
    <text x="34" y="90" fontFamily="Albert Sans, Arial, sans-serif" fontSize="16" letterSpacing="3" fill="#56615a">PAR {par}</text>
  </svg>
}

/* Yardage book: all eighteen holes with a schematic plan, tee distances and playing notes. */
export default function HoleExplorer({ slug, initial }: { slug: string; initial: number }) {
  const { text, read, locale } = useSite()
  const holes = courseHoles[slug]
  const [index, setIndex] = useState(() => Math.max(0, holes.findIndex(item => item.number === initial)))
  const hole = holes[index]
  const root = useRef<HTMLDivElement>(null)
  const swipe = useRef<number | null>(null)
  const number = (value: number) => value.toLocaleString(locale)

  useGSAP(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .from('.yardage__sheet', { y: 28, opacity: 0, duration: 1 }, 0)
        .from('.yardage__number > span', { yPercent: 100, duration: 1.1 }, 0)
        .from('.yardage__detail > *', { y: 18, opacity: 0, duration: .9, stagger: .05 }, .1)
    })
    return () => media.revert()
  }, { scope: root, dependencies: [index], revertOnUpdate: true })

  const select = (next: number, focus = false) => {
    const target = (next + holes.length) % holes.length
    setIndex(target)
    if (focus) document.getElementById(`hole-tab-${target}`)?.focus()
  }
  const navigate = (event: KeyboardEvent<HTMLButtonElement>, current: number) => {
    const moves: Record<string, number> = { ArrowRight: current + 1, ArrowDown: current + 1, ArrowLeft: current - 1, ArrowUp: current - 1, Home: 0, End: holes.length - 1 }
    if (!(event.key in moves)) return
    event.preventDefault()
    select(moves[event.key], true)
  }
  const nines = [holes.slice(0, 9), holes.slice(9)]

  return <div className="yardage" ref={root}>
    <div className="yardage__rail" role="tablist" aria-label={text('Le 18 buche', 'The 18 holes')}>
      {nines.map((nine, half) => <div className="yardage__nine" key={half}>
        <span className="yardage__half" aria-hidden="true">{half ? text('Ritorno', 'In') : text('Andata', 'Out')}</span>
        <div className="yardage__holes">{nine.map(item => {
          const position = holes.indexOf(item)
          return <button key={item.number} id={`hole-tab-${position}`} role="tab" aria-selected={position === index} aria-controls="hole-panel" tabIndex={position === index ? 0 : -1} onKeyDown={event => navigate(event, position)} onClick={() => select(position)}>
            <span className="visually-hidden">{text('Buca', 'Hole')} </span>{item.number}
            <span className="yardage__par" aria-hidden="true">{Array.from({ length: item.par }, (_, dot) => <i key={dot} />)}</span>
          </button>
        })}</div>
      </div>)}
    </div>

    <div className="yardage__stage" role="tabpanel" id="hole-panel" aria-labelledby={`hole-tab-${index}`} tabIndex={0}>
      <figure className="yardage__sheet" onPointerDown={event => { if (event.pointerType !== 'mouse') swipe.current = event.clientX }} onPointerCancel={() => { swipe.current = null }} onPointerUp={event => {
        if (swipe.current === null) return
        const delta = event.clientX - swipe.current
        swipe.current = null
        if (Math.abs(delta) > 50) select(index + (delta < 0 ? 1 : -1))
      }}>
        <HolePlan hole={hole} label={text('Schema della buca {n}: fairway, bunker, ostacoli e green', 'Plan of hole {n}: fairway, bunkers, hazards and green').replace('{n}', String(hole.number))} />
        <figcaption><span>{text('Buca', 'Hole')} {hole.number}</span><span>{text('Schema indicativo', 'Indicative plan')}</span></figcaption>
      </figure>
      <div className="yardage__detail">
        <p className="yardage__number" aria-hidden="true"><span>{String(hole.number).padStart(2, '0')}</span></p>
        <h3>{text('Buca', 'Hole')} {hole.number} <em>· Par {hole.par}</em></h3>
        <p className="yardage__meta">Hcp {hole.hcp}</p>
        <dl className="yardage__tees">{hole.lengths.map((length, tee) => <div key={tee}><dt><span className={`tee-dot tee-dot--${tee}`} />{read(teeColors[tee])}</dt><dd>{number(length)}<small> m</small></dd></div>)}</dl>
        <p className="yardage__text">{read(hole.text)}</p>
        <div className="yardage__nav">
          <button type="button" onClick={() => select(index - 1)}><ArrowLeft size={16} strokeWidth={1.25} aria-hidden="true" />{text('Buca precedente', 'Previous hole')}</button>
          <button type="button" onClick={() => select(index + 1)}>{text('Buca successiva', 'Next hole')}<ArrowRight size={16} strokeWidth={1.25} aria-hidden="true" /></button>
        </div>
      </div>
    </div>

    <details className="scorecard">
      <summary>{text('Lo score card completo', 'The full scorecard')}</summary>
      <div className="scorecard__wrap">
        <table>
          <caption className="visually-hidden">{text('Par e distanze di tutte le buche, in metri', 'Par and distances for every hole, in metres')}</caption>
          <thead><tr><th scope="col">{text('Buca', 'Hole')}</th><th scope="col">Par</th><th scope="col" className="scorecard__hcp">Hcp</th>{teeColors.map((color, tee) => <th scope="col" key={tee}><span className={`tee-dot tee-dot--${tee}`} /><span className="scorecard__tee">{read(color)}</span></th>)}</tr></thead>
          {nines.map((nine, half) => <tbody key={half}>
            {nine.map(item => <tr key={item.number}><th scope="row">{item.number}</th><td>{item.par}</td><td className="scorecard__hcp">{item.hcp}</td>{item.lengths.map((length, tee) => <td key={tee}>{number(length)}</td>)}</tr>)}
            <tr className="scorecard__total"><th scope="row">{half ? text('Ritorno', 'In') : text('Andata', 'Out')}</th><td>{sum(nine.map(item => item.par))}</td><td className="scorecard__hcp" />{[0, 1, 2, 3].map(tee => <td key={tee}>{number(sum(nine.map(item => item.lengths[tee])))}</td>)}</tr>
          </tbody>)}
          <tfoot><tr><th scope="row">{text('Totale', 'Total')}</th><td>{sum(holes.map(item => item.par))}</td><td className="scorecard__hcp" />{[0, 1, 2, 3].map(tee => <td key={tee}>{number(sum(holes.map(item => item.lengths[tee])))}</td>)}</tr></tfoot>
        </table>
      </div>
      <p className="scorecard__note">{text('Distanze in metri. Percorso e dati sono inventati per la demo.', 'Distances in metres. Course and figures are invented for the demo.')}</p>
    </details>
  </div>
}
