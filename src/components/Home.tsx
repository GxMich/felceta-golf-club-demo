import { lazy, Suspense, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSite } from '../lib/site'
import { golfCourses } from '../data/experience'
import { contact, roomsUrl, teeTimeUrl } from '../data/site'
import { Arrow, Lines, Photo, Crest, SiteLink, TextLink } from './Shared'
import Conditions from './Conditions'

const CoursePhoto = lazy(() => import('./CoursePhoto'))

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

/* Every choice continues to the enquiry with the preferences already filled in. Nothing is booked. */
function VisitPlanner() {
  const { text, url } = useSite()
  const navigate = useNavigate()
  const [intent, setIntent] = useState('golf')
  const [date, setDate] = useState('')
  const [nights, setNights] = useState('2')
  const [attendees, setAttendees] = useState('20')
  const groups = [{ id: '10', label: text('Fino a 10', 'Up to 10') }, { id: '20', label: '10–20' }, { id: '40', label: '20–40' }, { id: '60', label: '40–60' }, { id: 'more', label: text('Oltre 60', 'More than 60') }]
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const params = new URLSearchParams({ intent })
    if (date && intent !== 'membership') params.set('arrival', date)
    if (intent === 'stay') params.set('nights', nights)
    if (intent === 'event') params.set('attendees', attendees)
    navigate(url(`/richiesta?${params}`))
  }
  return <form className="planner" onSubmit={submit} aria-label={text('Organizza la visita', 'Plan your visit')}>
    <div className="planner__field"><label htmlFor="planner-intent">{text('Vorrei', 'I would like')}</label><select id="planner-intent" value={intent} onChange={event => setIntent(event.target.value)}><option value="golf">{text('Giocare', 'To play')}</option><option value="stay">{text('Soggiornare', 'To stay')}</option><option value="event">{text('Organizzare un evento', 'To host an event')}</option><option value="membership">{text('Diventare socio', 'To join')}</option></select></div>
    {intent !== 'membership' ? <div className="planner__field"><label htmlFor="planner-date">{intent === 'stay' ? text('Arrivo', 'Arrival') : text('Data', 'Date')}</label><input id="planner-date" type="date" min={localDate()} value={date} onChange={event => setDate(event.target.value)} /></div> : null}
    {intent === 'stay' ? <div className="planner__field"><label htmlFor="planner-nights">{text('Notti', 'Nights')}</label><select id="planner-nights" value={nights} onChange={event => setNights(event.target.value)}>{Array.from({ length: 14 }, (_, index) => <option key={index} value={index + 1}>{index + 1}</option>)}</select></div> : null}
    {intent === 'event' ? <div className="planner__field"><label htmlFor="planner-attendees">{text('Partecipanti', 'Guests')}</label><select id="planner-attendees" value={attendees} onChange={event => setAttendees(event.target.value)}>{groups.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div> : null}
    <button type="submit" className="planner__submit">{intent === 'golf' ? text('Chiedi un tee time', 'Request a tee time') : intent === 'stay' ? text('Chiedi disponibilità', 'Ask for availability') : text('Continua', 'Continue')}<Arrow /></button>
  </form>
}

function CourseShowcase() {
  const { text, read, url, locale } = useSite()
  const [selected, setSelected] = useState(0)
  const course = golfCourses[selected]
  const navigateTabs = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index
    setSelected(next)
    document.getElementById(`course-tab-${next}`)?.focus()
  }
  return <section id="golf" className="lx-section lx-golf">
    <div className="page-width">
      <div className="lx-heading"><h2><Lines text={text('Due percorsi\nda diciotto buche.', 'Two eighteen-hole\ncourses.')} /></h2><p>{text('Gli alberi del Bosco. I laghi e il vento dei Canneti. Trentasei buche, due modi diversi di leggere la collina.', 'The trees of Il Bosco. The lakes and wind of I Canneti. Thirty-six holes, two different ways to read the hill.')}</p></div>
      <div className="course-tabs" role="tablist" aria-label={text('Scegli un percorso', 'Choose a course')}>{golfCourses.map((item, index) => <button key={item.slug} role="tab" id={`course-tab-${index}`} aria-controls="course-panel" aria-selected={selected === index} tabIndex={selected === index ? 0 : -1} onKeyDown={event => navigateTabs(event, index)} onClick={() => setSelected(index)}>{item.name}</button>)}</div>
      <div id="course-panel" className="course-stage" role="tabpanel" aria-labelledby={`course-tab-${selected}`} tabIndex={0}>
        <div className="golf-feature__visual"><Suspense fallback={<Photo name={course.image} alt={course.name} className="golf-feature__image" sizes="(max-width: 899px) 100vw, 62vw" />}><CoursePhoto image={course.image} name={course.name} /></Suspense></div>
        <div className="course-column">
          <p className="course-column__kicker">{read(course.character)}</p>
          <h3>{course.name}</h3>
          <p>{read(course.description)}</p>
          <dl className="course-numbers"><div><dt>{text('Buche', 'Holes')}</dt><dd>18</dd></div><div><dt>Par</dt><dd>72</dd></div><div><dt>{text('Dai bianchi', 'White tees')}</dt><dd>{course.lengths[0].toLocaleString(locale)}<small> m</small></dd></div></dl>
          <div className="course-column__links"><SiteLink href={url(`/golf/${course.slug}`)} className="button button--ink">{text('Esplora il percorso', 'Explore the course')}<Arrow /></SiteLink><SiteLink className="quiet-link" href={url(teeTimeUrl())}>{text('Chiedi un tee time', 'Request a tee time')}<Arrow /></SiteLink></div>
        </div>
      </div>
    </div>
  </section>
}

export default function Home() {
  const { text, url } = useSite()
  const residences = [
    { name: 'Villa Felceta', detail: 'Superior, Deluxe, Junior Suite.' },
    { name: text('Lodge del Frutteto', 'Orchard Lodge'), detail: 'Superior, Deluxe, Suite.' },
    { name: text('Foresteria', 'Guest house'), detail: text('Camere Standard, vicine alla segreteria.', 'Standard rooms, close to the club office.') },
    { name: text('Appartamenti', 'Apartments'), detail: text('Con cucina, a cinque minuti dalla Club House. Minimo tre notti.', 'With a kitchen, five minutes from the Club House. Three nights minimum.') },
  ]
  return <div className="lx-home">
    <section className="lx-hero">
      <div className="lx-hero__visual"><Photo name="estate-aerial" alt={text('La tenuta vista dall’alto, tra laghi, bunker e fairway', 'The estate from above, between lakes, bunkers and fairways')} className="hero__image" priority sizes="100vw" /></div>
      <div className="hero__intro lx-hero__content page-width">
        <h1 className="lx-hero__title" tabIndex={-1}><Lines text={text('Trentasei buche,\n*tra le colline.*', 'Thirty-six holes,\n*among the hills.*')} /></h1>
        <div className="lx-hero__lede"><p>{text('Colle Albero, dal 1979. Due percorsi da 18 buche, una villa dell’Ottocento e una tenuta di 140 ettari.', 'Colle Albero, since 1979. Two 18-hole courses, a nineteenth-century villa and a 140-hectare estate.')}</p><div className="lx-hero__links"><SiteLink href={url('/#golf')} className="hero__scroll">{text('I due percorsi', 'The two courses')}<Arrow direction="down" /></SiteLink><a href="#signature" className="hero__scroll">{text('La buca 14', 'The 14th hole')}<Arrow direction="down" /></a></div></div>
      </div>
      <div className="lx-hero__planner page-width"><Conditions className="conditions--hero" /><VisitPlanner /></div>
    </section>

    <section className="lx-section lx-manifesto" aria-labelledby="manifesto-title">
      <div className="page-width">
        <Crest className="lx-manifesto__mark" />
        <h2 id="manifesto-title" className="lx-manifesto__text">{text('Querce, felci, due laghi e una villa con le persiane verdi. Da oltre quarant’anni Felceta accoglie chi viene a giocare e ', 'Oaks, ferns, two lakes and a villa with green shutters. For over forty years Felceta has welcomed those who come to play and ')}<em>{text('chi decide di fermarsi.', 'those who decide to stay.')}</em></h2>
        <dl className="lx-facts">
          <div><dt>{text('Buche, su due percorsi', 'Holes across two courses')}</dt><dd>36</dd></div>
          <div><dt>{text('Le prime diciotto buche', 'The first eighteen holes')}</dt><dd>1979</dd></div>
          <div><dt>{text('Ettari di tenuta', 'Hectares of estate')}</dt><dd>140</dd></div>
          <div><dt>{text('Laghi sul percorso', 'Lakes on the course')}</dt><dd>7</dd></div>
        </dl>
      </div>
    </section>

    <CourseShowcase />

    <section id="signature" className="lx-ring" aria-labelledby="ring-title">
      <div className="lx-ring__stage">
        <div className="lx-ring__mask"><Photo name="island-green" alt={text('Il green della buca 14, su un’isola nel lago', 'The 14th green, on an island in the lake')} sizes="100vw" /></div>
        <div className="lx-ring__copy page-width">
          <h2 id="ring-title"><Lines text={text('Un’isola\n*nel lago.*', 'An island\n*in the lake.*')} /></h2>
          <p>{text('Buca 14 del Bosco, par 3. Il green sta in mezzo all’acqua e si raggiunge con un solo colpo: niente vie di mezzo, solo la distanza giusta.', 'The 14th on Il Bosco, a par 3. The green sits in the middle of the water and you reach it with a single shot: no halfway, only the right distance.')}</p>
          <SiteLink href={url('/golf/il-bosco?hole=14#holes')} className="button button--ivory">{text('Conosci la buca 14', 'Meet the 14th hole')}<Arrow /></SiteLink>
        </div>
      </div>
    </section>

    <section id="stay" className="lx-section lx-stay">
      <div className="page-width">
        <div className="lx-stay__grid">
          <figure className="lx-stay__main"><Photo name="villa" alt={text('Villa Felceta tra gli alberi e la nebbia del mattino', 'Villa Felceta among the trees in the morning mist')} sizes="(max-width: 899px) 100vw, 55vw" /></figure>
          <div className="lx-stay__copy">
            <h2><Lines text={text('Camere nella villa\ne nel lodge.', 'Rooms in the villa\nand the lodge.')} /></h2>
            <p>{text('Una villa dell’Ottocento, il legno caldo di una Junior Suite, gli alberi appena fuori dalla finestra. A Felceta il soggiorno comincia quando finisce il giro.', 'A nineteenth-century villa, the warm wood of a Junior Suite, trees just outside the window. At Felceta your stay begins when the round ends.')}</p>
            <div className="lx-stay__links"><TextLink href={url('/ospitalita')}>{text('Trova il tuo soggiorno', 'Find your stay')}</TextLink><SiteLink className="quiet-link" href={url(roomsUrl())}>{text('Chiedi disponibilità', 'Ask for availability')}<Arrow /></SiteLink></div>
            <figure className="lx-stay__detail"><Photo name="suite" alt={text('Luce del pomeriggio nella Junior Suite di Villa Felceta', 'Afternoon light in the Junior Suite at Villa Felceta')} sizes="(max-width: 899px) 90vw, 32vw" /><figcaption>Junior Suite, Villa Felceta</figcaption></figure>
          </div>
        </div>
        <ul className="lx-residences">{residences.map(item => <li key={item.name}><h3>{item.name}</h3><p>{item.detail}</p></li>)}</ul>
        <div className="lx-offer"><p><em>{text('Due notti, tre giri.', 'Two nights, three rounds.')}</em></p><SiteLink className="quiet-link" href={url('/richiesta?intent=stay&golf=1')}>{text('Chiedi la formula Stay & Play', 'Ask about Stay & Play')}<Arrow /></SiteLink></div>
      </div>
    </section>

    <section id="experience" className="lx-section lx-club">
      <div className="page-width">
        <div className="lx-heading lx-heading--light"><h2><Lines text={text('Oltre il golf.', 'Beyond golf.')} /></h2><p>{text('Prima del primo tee e dopo l’ultima buca. Una piscina all’ombra, un tavolo apparecchiato, qualcuno con cui ritrovarsi.', 'Before the first tee and after the last hole. A shaded pool, a table set for dinner, someone to meet again.')}</p></div>
        <div className="lx-club__cards">
          <article className="lx-card"><div className="lx-card__image"><Photo name="pool" alt={text('La piscina estiva sotto gli alberi', 'The summer pool under the trees')} sizes="(max-width: 899px) 100vw, 40vw" /></div><h3>Country Club</h3><p>{text('Piscina estiva, due campi da tennis, una piccola palestra con sauna. Formule anche per chi non gioca a golf.', 'A summer pool, two tennis courts, a small gym with sauna. Memberships for non-golfers too.')}</p><TextLink light href={url('/membership')}>{text('Scopri il Country Club', 'Explore the Country Club')}</TextLink></article>
          <article className="lx-card"><div className="lx-card__image"><Photo name="restaurant" alt={text('La sala del ristorante apparecchiata per la cena', 'The restaurant dining room laid for dinner')} sizes="(max-width: 899px) 100vw, 40vw" /></div><h3>{text('A tavola', 'At the table')}</h3><p>{text('Il ristorante della Club House: cucina di stagione a pranzo, cena su prenotazione il venerdì e il sabato.', 'The Club House restaurant: seasonal cooking at lunch, dinner by reservation on Fridays and Saturdays.')}</p><TextLink light href={url('/eventi')}>{text('Pranzi e cene di gruppo', 'Group lunches and dinners')}</TextLink></article>
          <article className="lx-card"><div className="lx-card__image"><Photo name="bunker" alt={text('Un colpo dal bunker vicino al green', 'A bunker shot near the green')} sizes="(max-width: 899px) 100vw, 40vw" /></div><h3>Academy</h3><p>{text('Il primo swing o un gesto da ritrovare. Cinque lezioni per chi comincia e un campo pratica coperto per l’inverno.', 'Your first swing or a feel to find again. Five lessons for beginners and a covered driving range for winter.')}</p><TextLink light href={url('/richiesta?intent=golf&academy=1')}>{text('Inizia dall’Academy', 'Start at the Academy')}</TextLink></article>
        </div>
      </div>
    </section>

    <section className="lx-section lx-strip" aria-labelledby="strip-title">
      <div className="page-width lx-strip__head"><h2 id="strip-title"><Lines text={text('La tenuta\nin sei fotografie.', 'The estate\nin six photographs.')} /></h2></div>
      <ul className="lx-strip__track">
        {[
          { name: 'villa-evening', label: text('La villa nella luce della sera', 'The villa in the evening light') },
          { name: 'waterlily', label: text('Le ninfee del laghetto della 5', 'Water lilies in the pond on the 5th') },
          { name: 'course-sunset', label: text('I Canneti al tramonto', 'I Canneti at sunset') },
          { name: 'aerial-detail', label: text('Fairway e bunker, dall’alto', 'Fairways and bunkers from above') },
          { name: 'lake-evening', label: text('La sera sul lago grande', 'Evening on the large lake') },
          { name: 'reeds', label: text('Canneti controluce', 'Reeds against the light') },
        ].map(item => <li key={item.name} className="lx-strip__item"><figure><Photo name={item.name} alt={item.label} sizes="(max-width: 599px) 80vw, (max-width: 899px) 45vw, 30vw" /><figcaption>{item.label}</figcaption></figure></li>)}
      </ul>
    </section>

    <section id="heritage" className="lx-section lx-heritage">
      <div className="page-width lx-heritage__grid">
        <figure className="lx-heritage__photo"><Photo name="heritage" alt={text('Un vecchio rustico in pietra in mezzo al prato', 'An old stone barn in the middle of a meadow')} sizes="(max-width: 899px) 100vw, 55vw" /><figcaption>{text('Il rustico dove si riunivano i primi soci.', 'The barn where the first members used to meet.')}</figcaption></figure>
        <div className="lx-heritage__copy">
          <h2><Lines text={text('Oltre quarant’anni\ndi gioco.', 'Over forty years\nof golf.')} /></h2>
          <p>{text('Un gruppo di amici, una cascina con troppi prati e l’idea di tracciare nove buche. Poi diciotto, poi trentasei.', 'A group of friends, a farmhouse with too many meadows and the idea of laying out nine holes. Then eighteen, then thirty-six.')}</p>
          <ol className="lx-timeline">
            <li><span>1977</span>{text('Le prime buche prendono forma tra i prati.', 'The first holes take shape in the meadows.')}</li>
            <li><span>1979</span>{text('Apre il percorso del Bosco.', 'Il Bosco opens.')}</li>
            <li><span>2008</span>{text('I Canneti: trentasei buche, due percorsi.', 'I Canneti: thirty-six holes, two courses.')}</li>
            <li><span>2021</span>{text('I laghi raccolgono la pioggia per l’irrigazione.', 'The lakes collect rainwater for irrigation.')}</li>
          </ol>
          <TextLink href={url('/membership')}>{text('Entra nel circolo', 'Join the club')}</TextLink>
        </div>
      </div>
    </section>

    <section id="membership" className="lx-membership">
      <div className="lx-membership__visual"><Photo name="lake" alt={text('Il lago e il fairway lungo il percorso', 'The lake and fairway along the course')} sizes="100vw" /></div>
      <div className="lx-membership__copy page-width">
        <h2><Lines text={text('Da ospite\na socio.', 'From guest\nto member.')} /></h2>
        <p>{text('Membership Golf e Country Club, formule per giovani e per chi comincia. Scegli il tuo modo di tornare a Felceta.', 'Golf and Country Club membership, options for younger players and beginners. Find your way back to Felceta.')}</p>
        <SiteLink href={url('/membership')} className="button button--ivory">{text('Scopri la membership', 'Explore membership')}<Arrow /></SiteLink>
      </div>
    </section>

    <section className="lx-section lx-visit">
      <div className="page-width">
        <Crest className="lx-visit__mark" />
        <h2><Lines text={text('Ci vediamo\n*a Felceta.*', 'See you\n*at Felceta.*')} /></h2>
        <p>{text('Una partita, un soggiorno, la tua membership. Cominciamo dalla visita che hai in mente.', 'A round, a stay, your membership. Let’s begin with the visit you have in mind.')}</p>
        <div className="lx-visit__actions"><SiteLink href={url('/richiesta')} className="button button--ink">{text('Organizza la visita', 'Plan your visit')}<Arrow /></SiteLink><a className="quiet-link" href={contact.phoneHref}>{contact.phone}</a></div>
        <div className="lx-visit__directions"><p>{text('A dieci minuti dal casello autostradale, con parcheggio gratuito davanti alla Club House.', 'Ten minutes from the motorway exit, with free parking in front of the Club House.')}</p></div>
      </div>
    </section>
  </div>
}
