import { tr } from '../lib/site'
import type { Translation } from '../lib/site'
import { courseLength } from './holes'

const lengths = (slug: string) => [0, 1, 2, 3].map(tee => courseLength(slug, tee)) as [number, number, number, number]

export const golfCourses = [
  {
    slug: 'il-bosco', name: 'Il Bosco', image: 'bosco-green', hero: 'bosco-fairway',
    character: tr('Il parkland di Felceta.', 'Felceta’s parkland.'),
    short: tr('Querce, castagni e fairway che seguono la collina.', 'Oaks, chestnuts and fairways that follow the hill.'),
    description: tr('Il primo percorso, aperto nel 1979. Si gioca tra alberi adulti e piccoli dislivelli: ogni buca chiede di scegliere una linea e di restarci.', 'The first course, opened in 1979. You play among mature trees and gentle slopes: every hole asks you to choose a line and keep to it.'),
    proof: tr('La buca 14 ha il green su un’isola nel lago: è la fotografia che quasi tutti portano a casa.', 'The 14th has its green on an island in the lake: it is the photograph almost everyone takes home.'),
    lengths: lengths('il-bosco'),
  },
  {
    slug: 'i-canneti', name: 'I Canneti', image: 'canneti-lake', hero: 'canneti-pond',
    character: tr('Acqua e vento.', 'Water and wind.'),
    short: tr('Laghi, canneti e orizzonti aperti.', 'Lakes, reeds and open horizons.'),
    description: tr('Il secondo percorso, aperto nel 2008 nella parte bassa della tenuta. Pochi alberi, molta acqua: qui la strategia la decide il vento.', 'The second course, opened in 2008 in the lower part of the estate. Few trees, plenty of water: here the wind sets the strategy.'),
    proof: tr('Sui Canneti i cani sono benvenuti al guinzaglio, nel rispetto del campo e degli altri giocatori.', 'Dogs are welcome on a lead at I Canneti, with respect for the course and other players.'),
    lengths: lengths('i-canneti'),
  },
] as const

/* Room types of the fictional estate. Types without a photograph get a card of practical facts instead. */
export type Room = { id: string; name: Translation; place: Translation; building: 'foresteria' | 'both' | 'villa' | 'lodge' | 'apartments'; detail: Translation; image?: string; caption?: Translation; facts?: Translation[] }

export const rooms: Room[] = [
  {
    id: 'standard', name: tr('Standard', 'Standard'), place: tr('Foresteria', 'Guest house'), building: 'foresteria',
    detail: tr('Camere semplici e luminose, a due passi dalla segreteria e dal campo pratica.', 'Simple, bright rooms, a few steps from the club office and the driving range.'),
    facts: [
      tr('Camera pronta dalle 15:00, partenza entro le 11:00', 'Room ready from 15:00, check-out by 11:00'),
      tr('Colazione in Club House dalle 7:00 alle 10:30', 'Breakfast in the Club House from 7:00 to 10:30'),
      tr('Cani ammessi su richiesta', 'Dogs welcome on request'),
    ],
  },
  {
    id: 'superior', name: tr('Superior', 'Superior'), place: tr('Villa e Lodge', 'Villa and Lodge'), building: 'both',
    detail: tr('Puoi scegliere tra le stanze della villa e quelle del Lodge del Frutteto, affacciate sul primo tee.', 'Choose between rooms in the villa and in the Orchard Lodge, overlooking the first tee.'),
    image: 'room-classic', caption: tr('Una camera Superior', 'A Superior room'),
  },
  {
    id: 'deluxe', name: tr('Deluxe', 'Deluxe'), place: tr('Villa e Lodge', 'Villa and Lodge'), building: 'both',
    detail: tr('Più spazio e un piccolo salotto, con la vista sul percorso del Bosco.', 'More space and a small sitting area, with a view of the Bosco course.'),
    image: 'villa-aerial', caption: tr('La villa tra gli ulivi e i cipressi', 'The villa among olives and cypresses'),
  },
  {
    id: 'junior-suite', name: tr('Junior Suite', 'Junior Suite'), place: tr('Villa Felceta', 'Villa Felceta'), building: 'villa',
    detail: tr('Al primo piano della villa ottocentesca, con soffitti alti e una finestra sugli alberi.', 'On the first floor of the nineteenth-century villa, with high ceilings and a window onto the trees.'),
    image: 'suite', caption: tr('Junior Suite, Villa Felceta', 'Junior Suite, Villa Felceta'),
  },
  {
    id: 'suite', name: tr('Suite', 'Suite'), place: tr('Lodge del Frutteto', 'Orchard Lodge'), building: 'lodge',
    detail: tr('La camera più grande del Lodge, con terrazzo privato e un salotto comune per gli ospiti.', 'The largest room in the Lodge, with a private terrace and a shared lounge for guests.'),
    image: 'lounge', caption: tr('Il salotto comune del Lodge', 'The Lodge’s shared lounge'),
  },
  {
    id: 'apartment', name: tr('Appartamento', 'Apartment'), place: tr('Appartamenti della tenuta', 'Estate apartments'), building: 'apartments',
    detail: tr('Per chi resta qualche giorno o viaggia in famiglia: cucina, ingresso indipendente e la Club House a cinque minuti a piedi.', 'For longer stays or family trips: a kitchen, a private entrance and the Club House a five-minute walk away.'),
    facts: [
      tr('Soggiorno minimo di 3 notti', 'Minimum stay of 3 nights'),
      tr('Cucina attrezzata e lavatrice', 'Equipped kitchen and washing machine'),
      tr('Parcheggio riservato', 'Private parking'),
      tr('Green fee ridotto per gli ospiti', 'Reduced green fees for guests'),
    ],
  },
]

export const teeColors = [tr('Bianchi', 'White'), tr('Gialli', 'Yellow'), tr('Blu', 'Blue'), tr('Rossi', 'Red')]
