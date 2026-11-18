/* Hole-by-hole data for the two fictional courses. Every figure and note is invented for the demo.
 * Distances are given from the white tees; the other tees are derived with fixed ratios so the scorecard adds up. */
import { tr } from '../lib/site'
import type { Translation } from '../lib/site'

export type Shape = { bend?: 'left' | 'right'; water?: 'front' | 'left' | 'right' | 'around' | 'cross'; bunkers: number; trees?: 'left' | 'right' | 'both' }
export type Hole = { number: number; par: number; hcp: number; lengths: readonly [number, number, number, number]; shape: Shape; text: Translation }

const tees = (white: number) => [white, Math.round(white * .95), Math.round(white * .88), Math.round(white * .84)] as const

const hole = (number: number, par: number, hcp: number, white: number, shape: Shape, it: string, en: string): Hole =>
  ({ number, par, hcp, lengths: tees(white), shape, text: tr(it, en) })

export const courseHoles: Record<string, readonly Hole[]> = {
  'il-bosco': [
    hole(1, 4, 9, 362, { bunkers: 2, trees: 'both' }, 'Una partenza tranquilla tra due file di querce. Il fairway è largo: meglio stare a sinistra per vedere bene il green.', 'A gentle opening between two rows of oaks. The fairway is wide: favour the left for a clear look at the green.'),
    hole(2, 4, 3, 389, { bend: 'right', bunkers: 3, trees: 'right' }, 'Leggero dogleg a destra. Chi taglia sopra gli alberi accorcia molto, ma il green è stretto e difeso davanti.', 'A gentle dogleg right. Cutting over the trees saves a lot, but the green is narrow and guarded at the front.'),
    hole(3, 3, 15, 158, { bunkers: 2, trees: 'left' }, 'Par 3 corto con il green in leggera salita. Il vento tra i rami inganna: un bastone in più non guasta.', 'A short par 3 to a slightly raised green. The breeze in the branches is misleading: one more club rarely hurts.'),
    hole(4, 5, 7, 486, { bend: 'left', bunkers: 3, trees: 'both' }, 'Il primo par 5 piega a sinistra dopo il drive. In tre colpi è una buca serena, in due serve coraggio.', 'The first par 5 turns left after the drive. In three it is a calm hole; in two it takes some nerve.'),
    hole(5, 4, 1, 401, { water: 'front', bunkers: 2, trees: 'right' }, 'La buca più difficile del percorso. Il secondo colpo deve superare uno stagno che protegge tutto il fronte del green.', 'The hardest hole on the course. The approach must carry a pond that covers the whole front of the green.'),
    hole(6, 4, 11, 344, { bend: 'right', bunkers: 2, trees: 'left' }, 'Un par 4 corto in discesa. Un ferro dal tee lascia un approccio comodo verso un green a due livelli.', 'A short downhill par 4. An iron from the tee leaves a simple approach to a two-tier green.'),
    hole(7, 3, 17, 142, { bunkers: 3 }, 'Il par 3 più corto, circondato da tre bunker. Conta solo la precisione.', 'The shortest par 3, ringed by three bunkers. Only accuracy matters here.'),
    hole(8, 4, 5, 378, { bend: 'left', bunkers: 2, trees: 'both' }, 'Il fairway sale verso un pianoro alberato. Dal punto più alto si vede finalmente la bandiera.', 'The fairway climbs to a wooded plateau. Only from the top do you finally see the flag.'),
    hole(9, 5, 13, 471, { bunkers: 3, trees: 'right' }, 'Si torna verso la Club House. Un par 5 raggiungibile, con il green lungo e in leggera pendenza.', 'Back towards the Club House. A reachable par 5 with a long green that tilts gently.'),
    hole(10, 4, 8, 367, { bend: 'right', bunkers: 2, trees: 'both' }, 'Il ritorno comincia dal tee più alto del percorso. Il drive scende, il secondo colpo risale verso il green.', 'The back nine starts from the highest tee on the course. The drive falls away, the approach climbs back up.'),
    hole(11, 4, 4, 395, { water: 'left', bunkers: 1, trees: 'right' }, 'Un fosso corre lungo tutto il lato sinistro. Meglio rinunciare a qualche metro e restare a destra.', 'A ditch runs along the whole left side. Better to give up a few metres and stay right.'),
    hole(12, 3, 16, 151, { bunkers: 2, trees: 'both' }, 'Un par 3 tra i castagni. Il green è ampio ma con una pendenza forte da dietro in avanti.', 'A par 3 among chestnut trees. The green is large but slopes sharply from back to front.'),
    hole(13, 5, 10, 498, { bend: 'left', bunkers: 4, trees: 'left' }, 'Il par 5 più lungo. Quattro bunker segnano la strada: contarli aiuta a scegliere la linea.', 'The longest par 5. Four bunkers mark the way: counting them helps you pick your line.'),
    hole(14, 3, 6, 176, { water: 'around', bunkers: 1 }, 'La buca simbolo del circolo: il green è un’isola nel lago. Si gioca un solo colpo, e si ricorda a lungo.', 'The club’s signature hole: the green is an island in the lake. You play a single shot and remember it for a long time.'),
    hole(15, 4, 12, 352, { bunkers: 2, trees: 'both' }, 'Un par 4 dritto e onesto, che premia un drive in mezzo al fairway.', 'A straight, honest par 4 that rewards a drive down the middle.'),
    hole(16, 4, 2, 412, { bend: 'right', water: 'right', bunkers: 2, trees: 'left' }, 'Lungo e in leggera salita, con l’acqua sulla destra per tutta la seconda metà della buca.', 'Long and slightly uphill, with water on the right for the whole second half of the hole.'),
    hole(17, 5, 14, 479, { bunkers: 3, trees: 'both' }, 'L’ultimo par 5 è un’occasione per recuperare un colpo, se il drive resta in fairway.', 'The last par 5 is a chance to win back a shot, as long as the drive stays on the fairway.'),
    hole(18, 4, 18, 336, { bend: 'left', bunkers: 2, trees: 'right' }, 'Si chiude sotto la terrazza della Club House, con un green che guarda verso la villa.', 'The round ends below the Club House terrace, on a green that looks towards the villa.'),
  ],
  'i-canneti': [
    hole(1, 4, 7, 371, { water: 'right', bunkers: 2 }, 'Si parte lungo il primo lago. Il fairway è largo ma l’acqua resta sempre in vista sulla destra.', 'You start alongside the first lake. The fairway is wide, but the water is always in view on the right.'),
    hole(2, 3, 15, 149, { water: 'front', bunkers: 1 }, 'Un par 3 corto sopra uno specchio d’acqua. Davanti al green c’è poco spazio per sbagliare.', 'A short par 3 over a stretch of water. There is little room for error in front of the green.'),
    hole(3, 5, 3, 502, { bend: 'right', water: 'right', bunkers: 2 }, 'Un par 5 lungo che segue la riva. Chi taglia sopra i canneti guadagna terreno, ma rischia la palla.', 'A long par 5 that follows the shore. Cutting over the reeds gains ground but risks the ball.'),
    hole(4, 4, 9, 358, { bunkers: 3 }, 'Una buca aperta, senza alberi. Il vento qui decide la scelta del bastone.', 'An open hole without trees. Here the wind decides which club you take.'),
    hole(5, 4, 1, 418, { water: 'cross', bunkers: 2 }, 'La più impegnativa: un canale attraversa il fairway a metà buca. Bisogna decidere se superarlo o restare corti.', 'The most demanding hole: a channel crosses the fairway halfway. You must decide whether to carry it or lay up.'),
    hole(6, 3, 13, 168, { bunkers: 3 }, 'Par 3 con un green largo e poco profondo, protetto da tre bunker in fila.', 'A par 3 to a wide, shallow green, protected by three bunkers in a row.'),
    hole(7, 4, 11, 339, { bend: 'left', water: 'left', bunkers: 1 }, 'Un dogleg corto a sinistra intorno a un piccolo lago. La linea prudente passa a destra.', 'A short dogleg left around a small lake. The safe line goes right.'),
    hole(8, 5, 5, 489, { water: 'front', bunkers: 2 }, 'Il green è dietro un laghetto: in due colpi è un rischio vero, in tre un approccio piacevole.', 'The green sits behind a pond: in two it is a real gamble, in three a pleasant pitch.'),
    hole(9, 4, 17, 326, { bunkers: 2 }, 'Un par 4 corto per chiudere l’andata, con il green rialzato e ben visibile dal tee.', 'A short par 4 to close the front nine, with a raised green in full view from the tee.'),
    hole(10, 5, 6, 495, { bend: 'right', bunkers: 3 }, 'Il ritorno si apre con un par 5 ampio. Il terzo colpo arriva su un green in salita.', 'The back nine opens with a generous par 5. The third shot lands on an uphill green.'),
    hole(11, 4, 2, 409, { water: 'left', bunkers: 2 }, 'Lunga e stretta, con l’acqua a sinistra dal tee al green. Un par qui vale molto.', 'Long and narrow, with water on the left from tee to green. A par here is worth a lot.'),
    hole(12, 3, 16, 137, { water: 'front', bunkers: 1 }, 'Il par 3 più corto passa sopra i canneti. Un colpo morbido basta, se la distanza è giusta.', 'The shortest par 3 plays over the reeds. A soft shot is enough, if the distance is right.'),
    hole(13, 4, 10, 364, { bend: 'left', bunkers: 2 }, 'Dogleg a sinistra con un bunker all’angolo. Superarlo apre la vista sul green.', 'A dogleg left with a bunker at the corner. Carry it and the green opens up.'),
    hole(14, 4, 8, 382, { water: 'right', bunkers: 2 }, 'Si gioca verso il lago più grande. Il green è a pochi metri dalla riva.', 'You play towards the largest lake. The green sits a few metres from the shore.'),
    hole(15, 5, 4, 511, { bend: 'right', water: 'cross', bunkers: 2 }, 'Il par 5 più lungo, con un canale da superare con il secondo colpo.', 'The longest par 5, with a channel to carry on the second shot.'),
    hole(16, 3, 12, 181, { water: 'right', bunkers: 2 }, 'Un par 3 lungo con l’acqua a destra. Meglio mancare il green a sinistra.', 'A long par 3 with water on the right. If you miss, miss left.'),
    hole(17, 4, 14, 347, { bunkers: 3 }, 'Fairway largo e green difeso da tre bunker. Una buca per respirare prima del finale.', 'A wide fairway and a green defended by three bunkers. A hole to breathe before the finish.'),
    hole(18, 4, 18, 368, { water: 'left', bunkers: 2 }, 'L’ultima buca costeggia il lago fino al green, davanti alla Club House.', 'The last hole follows the lake all the way to the green, in front of the Club House.'),
  ],
}

export const courseLength = (slug: string, tee = 0) => courseHoles[slug].reduce((total, item) => total + item.lengths[tee], 0)
