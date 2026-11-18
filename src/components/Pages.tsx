import { lazy, Suspense, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { golfCourses, rooms, teeColors } from '../data/experience'
import { roomsUrl } from '../data/site'
import { useSite } from '../lib/site'
import { Arrow, Lines, Photo, Crest, SiteLink, TextLink } from './Shared'
import { ContactBand, PageHero } from './Layout'

const HoleExplorer = lazy(() => import('./Holes'))

export function CoursePage() {
  const { slug } = useParams()
  const [search] = useSearchParams()
  const course = golfCourses.find(item => item.slug === slug)
  if (!course) return <NotFound />
  return <CourseDetail key={`${course.slug}-${search.toString()}`} course={course} />
}

/* Demo green fees: invented figures. */
const greenFees = [{ holes: 18, weekday: 65, holiday: 90 }, { holes: 9, weekday: 38, holiday: 55 }]

function CourseDetail({ course }: { course: typeof golfCourses[number] }) {
  const { text, read, url, locale } = useSite()
  const [search] = useSearchParams()
  const isClassic = course.slug === 'il-bosco'
  const other = golfCourses[isClassic ? 1 : 0]
  const enquiry = url(`/richiesta?intent=golf&course=${course.slug}`)
  const euro = (value: number) => new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value)
  return <>
    <PageHero image={course.hero} alt={isClassic ? text('Il fairway del Bosco tra querce e castagni', 'The Bosco fairway between oaks and chestnuts') : text('Un albero solitario e lo stagno lungo i Canneti', 'A lone tree and the pond along I Canneti')} title={isClassic ? 'Il Bosco' : 'I Canneti'} description={`${read(course.character)} ${text('18 buche, par 72.', '18 holes, par 72.')}`} className="course-hero"><div className="page-hero__actions"><SiteLink href={enquiry} className="button button--ivory">{text('Chiedi un tee time', 'Request a tee time')}<Arrow /></SiteLink><a href="#course-details" className="hero__stay">{text('Conosci il percorso', 'Get to know the course')}<Arrow direction="down" /></a></div></PageHero>
    <div className="page-width breadcrumb"><SiteLink href={url('/')}>Felceta</SiteLink><span>/</span><SiteLink href={url('/#golf')}>Golf</SiteLink><span>/</span><span>{course.name}</span></div>
    <section id="course-details" className="course-intro page-width"><div><h2>{read(course.character)}</h2><p>{read(course.description)}</p><p className="course-proof">{read(course.proof)}</p></div><dl className="course-facts"><div><dt>{text('Buche', 'Holes')}</dt><dd>18</dd></div><div><dt>Par</dt><dd>72</dd></div><div><dt>{text('Carattere', 'Character')}</dt><dd>{isClassic ? 'Parkland' : text('Acqua e vento', 'Water & wind')}</dd></div><div><dt>{text('Lunghezza dai bianchi', 'Length from white tees')}</dt><dd>{course.lengths[0].toLocaleString(locale)} m</dd></div></dl></section>
    <section id="holes" className="hole-discovery"><div className="page-width"><div className="section-heading"><h2><Lines text={text('Diciotto buche,\nuna alla volta.', 'Eighteen holes,\none at a time.')} /></h2><p>{text('Lo schema della buca, le distanze dalle quattro partenze e un consiglio per giocarla. Scegli una buca o scorri il percorso.', 'The hole layout, distances from all four tees and a tip on how to play it. Choose a hole or walk the course.')}</p></div><Suspense fallback={<div className="yardage yardage--loading" />}><HoleExplorer slug={course.slug} initial={Number(search.get('hole')) || 1} /></Suspense></div></section>
    <section className="course-practical page-width">
      <div>
        <h2>{text('Prima del primo tee.', 'Before the first tee.')}</h2>
        <p>{text('Scegli la partenza più adatta al tuo gioco. Per il tee time basta una richiesta: la segreteria conferma l’orario.', 'Choose the tees that suit your game. For a tee time, send a request: the club office confirms the slot.')}</p>
        <p className="small-note">{isClassic ? text('Sul Bosco i cani non sono ammessi.', 'Dogs are not allowed on Il Bosco.') : text('Cani ammessi al guinzaglio, nel rispetto del campo e degli altri giocatori.', 'Dogs welcome on a lead, with respect for the course and other players.')}</p>
        <table className="fee-table"><caption>Green fee</caption><thead><tr><th scope="col"><span className="visually-hidden">{text('Giro', 'Round')}</span></th><th scope="col">{text('Feriale', 'Weekdays')}</th><th scope="col">{text('Festivo', 'Weekends and holidays')}</th></tr></thead><tbody>{greenFees.map(fee => <tr key={fee.holes}><th scope="row">{fee.holes} {text('buche', 'holes')}</th><td>{euro(fee.weekday)}</td><td>{euro(fee.holiday)}</td></tr>)}</tbody></table>
        <p className="small-note">{text('Prezzi di esempio, inventati per la demo.', 'Sample prices, invented for the demo.')}</p>
      </div>
      <table className="tee-table"><caption>{text('Le partenze del percorso', 'Course tees')}</caption><thead><tr><th scope="col">Tee</th><th scope="col">{text('Lunghezza', 'Length')}</th></tr></thead><tbody>{course.lengths.map((length, index) => <tr key={index}><th scope="row"><span className={`tee-dot tee-dot--${index}`} />{read(teeColors[index])}</th><td>{length.toLocaleString(locale)} m</td></tr>)}</tbody></table>
    </section>
    <section className="course-next page-width"><Photo name={other.image} alt={other.name} /><div><h2>{other.name}</h2><p>{text('L’altro percorso di Felceta.', 'Felceta’s other course.')}</p><TextLink href={url(`/golf/${other.slug}`)}>{text('Scopri l’altro percorso', 'Discover the other course')}</TextLink></div></section>
    <section className="contact-band"><div className="page-width"><div><h2>{text('Ci vediamo sul tee.', 'See you on the tee.')}</h2><p>{text('Scegli il giorno e il numero di giocatori. Per gruppi e gare a squadre, scrivilo nella richiesta.', 'Pick the day and the number of players. For groups and team events, say so in your request.')}</p></div><div className="contact-band__actions"><SiteLink href={enquiry} className="button button--ivory">{text('Chiedi un tee time', 'Request a tee time')}<Arrow /></SiteLink></div></div></section>
  </>
}

export function StayPage() {
  const { text, read, url } = useSite()
  const [building, setBuilding] = useState('all')
  const [selected, setSelected] = useState('junior-suite')
  const [gallery, setGallery] = useState(1)
  const filtered = rooms.filter(room => building === 'all' || room.building === building || room.building === 'both' && ['villa', 'lodge'].includes(building))
  const room = filtered.find(item => item.id === selected) || filtered[0]
  const galleryImages = [
    { name: 'suite', label: text('Junior Suite, Villa Felceta', 'Junior Suite, Villa Felceta') },
    { name: 'room-classic', label: text('Una camera Superior', 'A Superior room') },
    { name: 'lounge', label: text('Il salotto comune del Lodge', 'The Lodge’s shared lounge') },
  ]
  const enquiry = url(`/richiesta?intent=stay&room=${room.id}`)
  return <>
    <PageHero image="villa" title={text('Dormire\na Felceta.', 'Stay\nat Felceta.')} description={text('La villa, il lodge, gli appartamenti e il golf a pochi passi.', 'The villa, the lodge, the apartments and the golf a few steps away.')} className="stay-hero"><div className="page-hero__actions"><SiteLink className="button button--ivory" href={url(roomsUrl())}>{text('Chiedi disponibilità', 'Ask for availability')}<Arrow /></SiteLink><a className="hero__stay" href="#rooms">{text('Scegli la tua camera', 'Choose your room')}<Arrow direction="down" /></a></div></PageHero>
    <div className="page-width breadcrumb"><SiteLink href={url('/')}>Felceta</SiteLink><span>/</span><span>{text('Ospitalità', 'Stay')}</span></div>
    <section className="stay-intro page-width"><h2>{text('Dove dormire', 'Where to stay')}</h2><div><p>{text('Le camere sono in tre edifici: la villa dell’Ottocento, il Lodge del Frutteto vicino al primo tee e la Foresteria accanto alla segreteria. Per i soggiorni lunghi ci sono gli appartamenti con cucina.', 'Rooms are spread over three buildings: the nineteenth-century villa, the Orchard Lodge near the first tee and the guest house next to the club office. For longer stays there are apartments with a kitchen.')}</p></div></section>
    <section className="stay-gallery page-width" aria-label={text('Fotografie delle camere', 'Room photographs')}><div className="stay-gallery__main"><Photo name={galleryImages[gallery].name} alt={galleryImages[gallery].label} sizes="(max-width: 700px) 100vw, 85vw" /><span>{galleryImages[gallery].label}</span></div><div className="gallery-choices">{galleryImages.map((item, index) => <button key={item.name} onClick={() => setGallery(index)} aria-pressed={index === gallery}><span>{item.label}</span></button>)}</div></section>
    <section id="rooms" className="room-collection"><div className="page-width"><div className="section-heading"><h2>{text('Camere\ne appartamenti.', 'Rooms\nand apartments.')}</h2><p>{text('Cinque tipologie di camera e gli appartamenti. Per disponibilità e prezzi basta una richiesta.', 'Five room types and the apartments. Send a request for availability and rates.')}</p></div><div className="building-filters" role="group" aria-label={text('Filtra per edificio', 'Filter by building')}>{[{ id: 'all', name: text('Tutte', 'All') }, { id: 'villa', name: 'Villa' }, { id: 'lodge', name: 'Lodge' }, { id: 'foresteria', name: text('Foresteria', 'Guest house') }, { id: 'apartments', name: text('Appartamenti', 'Apartments') }].map(item => <button key={item.id} aria-pressed={building === item.id} onClick={() => setBuilding(item.id)}>{item.name}</button>)}</div><div className="room-selector"><div className="room-options" role="group" aria-label={text('Tipologia di camera', 'Room type')}>{filtered.map(item => <button key={item.id} aria-pressed={room.id === item.id} onClick={() => setSelected(item.id)}><span>{read(item.name)}</span><small>{read(item.place)}</small></button>)}</div><div className="room-description" aria-live="polite">
      {room.image ? <figure className="room-description__photo"><Photo name={room.image} alt="" sizes="(max-width: 899px) 100vw, 45vw" />{room.caption ? <figcaption>{read(room.caption)}</figcaption> : null}</figure> : <div className="room-card"><Crest /><ul>{room.facts?.map(fact => <li key={fact.it}>{read(fact)}</li>)}</ul></div>}
      <h3>{read(room.name)}</h3><p className="room-description__place">{read(room.place)}</p><p>{read(room.detail)}</p>
      {room.image && room.facts ? <ul className="room-facts">{room.facts.map(fact => <li key={fact.it}>{read(fact)}</li>)}</ul> : null}
      <div className="room-description__actions"><SiteLink href={enquiry} className="button button--forest">{room.building === 'apartments' ? text('Richiedi un appartamento', 'Enquire about an apartment') : text('Chiedi questa camera', 'Ask about this room')}<Arrow /></SiteLink></div>
    </div></div></div></section>
    <section className="stay-practical page-width"><div><h2>{text('Prima di arrivare.', 'Before you arrive.')}</h2><p>{text('Qualche informazione utile per organizzare il soggiorno. Per esigenze particolari, scrivilo nella richiesta.', 'A few useful details to plan your stay. Mention any special needs in your request.')}</p></div><div className="practical-answers"><details><summary>{text('Arrivo e partenza', 'Arrival and departure')}</summary><p>{text('Le camere sono pronte dalle 15:00 e si lasciano entro le 11:00. La colazione è servita in Club House dalle 7:00 alle 10:30. Se arrivi tardi, avvisa la segreteria.', 'Rooms are ready from 15:00 and check-out is by 11:00. Breakfast is served in the Club House from 7:00 to 10:30. If you arrive late, let the office know.')}</p></details><details><summary>{text('Soggiorno e golf', 'Staying and playing')}</summary><p>{text('Con la formula Stay & Play due notti includono tre giri sui due percorsi. Chi dorme negli appartamenti ha il green fee ridotto.', 'With Stay & Play, two nights include three rounds across both courses. Apartment guests pay a reduced green fee.')}</p></details><details><summary>{text('Viaggi con il tuo cane?', 'Travelling with your dog?')}</summary><p>{text('I cani sono benvenuti nelle camere Standard e negli appartamenti, su richiesta. Sul percorso dei Canneti possono accompagnarti al guinzaglio.', 'Dogs are welcome in Standard rooms and apartments, on request. On I Canneti they can join you on a lead.')}</p></details></div></section>
    <ContactBand />
  </>
}

export function MembershipPage() {
  const { text, url } = useSite()
  return <>
    <PageHero image="clubhouse" title={text('Diventare\nsocio.', 'Become\na member.')} description={text('Golf e Country Club, due modi di sentirsi a casa a Felceta.', 'Golf and Country Club, two ways to feel at home at Felceta.')} className="membership-hero"><div className="page-hero__actions"><a href="#membership-options" className="button button--ivory">{text('Scopri le formule', 'Explore membership')}<Arrow direction="down" /></a></div></PageHero>
    <div className="page-width breadcrumb"><SiteLink href={url('/')}>Felceta</SiteLink><span>/</span><span>Membership</span></div>
    <section id="membership-options" className="membership-options page-width"><article><Photo name="aerial-course" alt={text('I percorsi di Felceta visti dall’alto', 'Felceta’s courses from above')} /><div><h2>Felceta Golf</h2><p>{text('Per chi vuole giocare spesso. Due percorsi da 18 buche, campo pratica, putting green e area di approccio.', 'For those who want to play often. Two 18-hole courses, a driving range, a putting green and a short-game area.')}</p><ul><li>{text('Formula annuale, formula feriale e quote ridotte per under 30 e principianti.', 'Annual and weekday memberships, with reduced fees for under-30s and beginners.')}</li><li>{text('Puoi aggiungere i servizi del Country Club in qualsiasi momento.', 'Country Club facilities can be added at any time.')}</li></ul><SiteLink className="button button--forest" href={url('/richiesta?intent=membership&membership=golf')}>{text('Parliamo della tua membership', 'Let’s talk about your membership')}<Arrow /></SiteLink></div></article><article><Photo name="pool" alt={text('La piscina del Country Club sotto gli alberi', 'The Country Club pool under the trees')} /><div><h2>Felceta Country Club</h2><p>{text('Per chi ama stare all’aperto, anche senza giocare a golf. Piscina estiva, tennis e una piccola area benessere.', 'For those who love the outdoors, even without playing golf. A summer pool, tennis and a small wellness area.')}</p><ul><li>{text('Country, per chi non gioca: piscina, tennis, palestra, sauna e Club House.', 'Country, for non-golfers: pool, tennis, gym, sauna and Club House.')}</li><li>{text('Country Inverno, per i soci Golf: palestra, sauna e campo pratica coperto.', 'Country Winter, for Golf members: gym, sauna and covered driving range.')}</li><li>{text('Country Estate, per i soci Golf: piscina e tennis da maggio a settembre.', 'Country Summer, for Golf members: pool and tennis from May to September.')}</li></ul><SiteLink className="button button--forest" href={url('/richiesta?intent=membership&membership=country')}>{text('Scopri come diventare socio', 'Find out how to join')}<Arrow /></SiteLink></div></article><div className="membership-official"><p>{text('La segreteria ti aiuta a scegliere la formula e ti spiega quote e condizioni.', 'The club office helps you choose a membership and explains fees and conditions.')}</p></div></section><ContactBand />
  </>
}

export function EventsPage() {
  const { text, url } = useSite()
  const enquiry = url('/richiesta?intent=event')
  return <>
    <PageHero image="villa-aerial" alt={text('La villa vista dall’alto tra ulivi e cipressi', 'The villa from above among olives and cypresses')} title={text('Eventi\ne gruppi.', 'Events\nand groups.')} description={text('Riunioni, feste private e settimane di golf in gruppo, nella quiete della collina.', 'Meetings, private celebrations and golf weeks for groups, in the quiet of the hills.')} className="events-hero"><div className="page-hero__actions"><SiteLink href={enquiry} className="button button--ivory">{text('Racconta il tuo evento', 'Tell us about your event')}<Arrow /></SiteLink><a href="#spaces" className="hero__stay">{text('Gli spazi', 'The spaces')}<Arrow direction="down" /></a></div></PageHero>
    <div className="page-width breadcrumb"><SiteLink href={url('/')}>Felceta</SiteLink><span>/</span><span>{text('Eventi', 'Events')}</span></div>
    <section className="events-intro page-width"><p className="events-intro__lead">{text('Una sala con le capriate nel vecchio fienile, una terrazza sulle colline e una cucina che segue il programma. ', 'A room under the timber trusses of the old hay barn, a terrace over the hills and a kitchen that follows your programme. ')}<em>{text('Il resto lo fa il paesaggio.', 'The landscape does the rest.')}</em></p></section>
    <section id="spaces" className="events-spaces page-width">
      <article className="event-space">
        <figure className="event-space__photo"><Photo name="meeting-room" alt={text('La sala del fienile con capriate bianche e tavoli lunghi', 'The barn room with white trusses and long tables')} sizes="(max-width: 899px) 100vw, 58vw" /></figure>
        <div className="event-space__copy">
          <h2>{text('La sala del fienile', 'The barn room')}</h2>
          <p>{text('Nel vecchio fienile accanto alla Club House: riunioni, workshop, presentazioni e feste private, con luce naturale da tre lati.', 'In the old hay barn next to the Club House: meetings, workshops, presentations and private parties, with daylight on three sides.')}</p>
          <dl className="event-facts">
            <div><dt>{text('Capienza', 'Capacity')}</dt><dd>70<small>{text(' posti a sedere', ' seated')}</small></dd></div>
            <div><dt>{text('Dotazioni', 'Equipment')}</dt><dd className="event-facts__list">{text('Impianto audio e microfoni · Proiettore e schermo · Tende oscuranti · Wi-Fi', 'Sound system and microphones · Projector and screen · Blackout blinds · Wi-Fi').split(' · ').map(item => <span key={item}>{item}</span>)}</dd></div>
          </dl>
        </div>
      </article>
      <article className="event-space event-space--reverse">
        <figure className="event-space__photo"><Photo name="hills-dawn" alt={text('Le colline nella nebbia dorata del mattino', 'The hills in the golden morning mist')} sizes="(max-width: 899px) 100vw, 58vw" /></figure>
        <div className="event-space__copy">
          <h2>{text('La terrazza sulle colline', 'The hillside terrace')}</h2>
          <p>{text('Guarda verso il Bosco e le colline. Da aprile a ottobre è il posto per il caffè delle pause e per l’aperitivo di fine giornata.', 'It looks towards Il Bosco and the hills. From April to October it is the place for coffee breaks and the end-of-day aperitivo.')}</p>
        </div>
      </article>
      <article className="event-space">
        <figure className="event-space__photo"><Photo name="dining-room" alt={text('La sala del ristorante apparecchiata con tovaglie bianche', 'The restaurant with tables laid in white linen')} sizes="(max-width: 899px) 100vw, 58vw" /></figure>
        <div className="event-space__copy">
          <h2>{text('Il ristorante', 'The restaurant')}</h2>
          <p>{text('La cucina della Club House prepara menù su misura per pause caffè, pranzi di lavoro e cene, costruiti sul programma della giornata.', 'The Club House kitchen prepares menus for coffee breaks, business lunches and dinners, built around the day’s programme.')}</p>
        </div>
      </article>
    </section>
    <section className="events-camp">
      <div className="events-camp__visual"><Photo name="bunker" alt={text('Un giocatore esce dal bunker vicino al green', 'A player splashes out of a bunker near the green')} sizes="100vw" /></div>
      <div className="page-width events-camp__copy">
        <h2>{text('Settimana di allenamento', 'Training week')}</h2>
        <p>{text('Sette giorni sul campo per maestri che portano i loro allievi, squadre di circolo e gruppi di amici con un capitano.', 'Seven days on the course for coaches bringing their pupils, club teams and groups of friends with a captain.')}</p>
        <ul className="events-camp__list">
          <li>{text('Alloggio negli appartamenti della tenuta', 'Accommodation in the estate apartments')}</li>
          <li>{text('Green fee illimitati sui due percorsi', 'Unlimited green fees on both courses')}</li>
          <li>{text('Campo pratica e palline senza limiti', 'Unlimited driving range and practice balls')}</li>
          <li>{text('Il maestro accompagnatore gioca gratis', 'The accompanying coach plays free')}</li>
        </ul>
        <p className="events-camp__note">{text('Formula di esempio, riservata ai gruppi e soggetta a disponibilità.', 'Sample package, for groups only and subject to availability.')}</p>
        <div className="events-camp__actions"><SiteLink href={url('/richiesta?intent=event&format=camp')} className="button button--ivory">{text('Chiedi la settimana di allenamento', 'Ask about the training week')}<Arrow /></SiteLink></div>
      </div>
    </section>
    <section className="events-steps page-width">
      <h2><Lines text={text('Dalla prima idea\nal giorno dell’evento.', 'From first idea\nto the day itself.')} /></h2>
      <ol>
        <li><span>I</span><h3>{text('Raccontaci l’evento', 'Tell us about it')}</h3><p>{text('Data, numero di ospiti e tipo di evento: bastano poche righe.', 'Date, number of guests and type of event: a few lines are enough.')}</p></li>
        <li><span>II</span><h3>{text('Ti facciamo una proposta', 'We send a proposal')}</h3><p>{text('La segreteria controlla gli spazi liberi e suggerisce menù e organizzazione.', 'The office checks which spaces are free and suggests menus and arrangements.')}</p></li>
        <li><span>III</span><h3>{text('Si conferma insieme', 'Confirm together')}</h3><p>{text('I dettagli si decidono insieme, senza impegno fino alla conferma.', 'Details are agreed together, with no commitment until you confirm.')}</p></li>
      </ol>
    </section>
    <section className="contact-band"><div className="page-width"><Crest className="contact-band__mark" /><div><h2><Lines text={text('Raccontaci\nil tuo evento.', 'Tell us\nabout your event.')} /></h2><p>{text('Prepara la richiesta in un minuto.', 'Prepare your enquiry in a minute.')}</p></div><SiteLink href={enquiry} className="button button--ivory">{text('Racconta il tuo evento', 'Tell us about your event')}<Arrow /></SiteLink></div></section>
  </>
}

export function NotFound() {
  const { text, url } = useSite()
  return <section className="not-found page-width"><span>404</span><h1 tabIndex={-1}>{text('Qui il percorso\ncambia direzione.', 'The course takes\na different turn here.')}</h1><p>{text('Questa pagina non esiste. Riparti dalla home o organizza la tua visita.', 'This page does not exist. Return to the home page or plan your visit.')}</p><SiteLink href={url('/')} className="button button--forest">{text('Torna a Felceta', 'Back to Felceta')}<Arrow /></SiteLink></section>
}
