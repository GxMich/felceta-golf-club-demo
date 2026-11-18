import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Check, Copy, Pencil, Send } from 'lucide-react'
import { useSite } from '../lib/site'
import { golfCourses, rooms } from '../data/experience'
import { Arrow, Photo } from './Shared'
import { contact } from '../data/site'

type Intent = 'stay' | 'golf' | 'event' | 'membership'
type Errors = Partial<Record<'arrival' | 'departure', string>>

function localDate() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export default function Enquiry() {
  const { text, read, locale } = useSite()
  const [search] = useSearchParams()
  const initialIntent = search.get('intent')
  const [intent, setIntent] = useState<Intent>(initialIntent === 'golf' || initialIntent === 'event' || initialIntent === 'membership' ? initialIntent : 'stay')
  const [arrival, setArrival] = useState(() => /^\d{4}-\d{2}-\d{2}$/.test(search.get('arrival') || '') ? search.get('arrival')! : '')
  const [departure, setDeparture] = useState(() => {
    const start = search.get('arrival'), nights = Number(search.get('nights'))
    if (!start || !/^\d{4}-\d{2}-\d{2}$/.test(start) || !nights) return ''
    const date = new Date(`${start}T12:00:00`)
    date.setDate(date.getDate() + nights)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  })
  const [guests, setGuests] = useState(() => ['1', '2', '3', '4', '5', '6', '7', '8'].includes(search.get('guests') || '') ? search.get('guests')! : '2')
  const [room, setRoom] = useState<string>(rooms.find(item => item.id === search.get('room'))?.id || 'any')
  const [course, setCourse] = useState<string>(golfCourses.find(item => item.slug === search.get('course'))?.slug || 'any')
  const [membership, setMembership] = useState(search.get('membership') === 'country' ? 'country' : 'golf')
  const [withGolf, setWithGolf] = useState(search.get('golf') === '1')
  const [sent, setSent] = useState(false)
  const [attendees, setAttendees] = useState(() => ['10', '20', '40', '60', 'more'].includes(search.get('attendees') || '') ? search.get('attendees')! : '20')
  const [format, setFormat] = useState(() => ['meeting', 'private', 'camp'].includes(search.get('format') || '') ? search.get('format')! : 'meeting')
  const [errors, setErrors] = useState<Errors>({})
  const [ready, setReady] = useState(false)
  const [copyState, setCopyState] = useState<'idle' | 'copying' | 'copied' | 'error'>('idle')
  const resultTitle = useRef<HTMLHeadingElement>(null)
  const formTitle = useRef<HTMLHeadingElement>(null)
  const previousStep = useRef(false)
  const today = localDate()
  useEffect(() => {
    if (previousStep.current === ready) return
    previousStep.current = ready
    const heading = ready ? resultTitle.current : formTitle.current
    heading?.focus({ preventScroll: true })
    heading?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, [ready])

  const formatDate = (value: string) => value ? new Intl.DateTimeFormat(locale, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${value}T12:00:00`)) : text('Da concordare', 'To be arranged')
  const chosenRoom = rooms.find(item => item.id === room)
  const roomName = chosenRoom ? read(chosenRoom.name) : text('Nessuna preferenza', 'No preference')
  const courseName = golfCourses.find(item => item.slug === course)?.name || text('Da concordare', 'To be arranged')
  const formats = [{ id: 'meeting', label: text('Riunione aziendale', 'Business meeting') }, { id: 'private', label: text('Festa privata', 'Private celebration') }, { id: 'camp', label: text('Settimana di allenamento', 'Training week') }]
  const groups = [{ id: '10', label: text('Fino a 10', 'Up to 10') }, { id: '20', label: '10–20' }, { id: '40', label: '20–40' }, { id: '60', label: '40–60' }, { id: 'more', label: text('Oltre 60', 'More than 60') }]
  const label = intent === 'stay' ? text('Soggiorno a Felceta', 'A stay at Felceta') : intent === 'golf' ? text('Tee time a Felceta', 'A tee time at Felceta') : intent === 'event' ? text('Evento a Felceta', 'An event at Felceta') : text('Membership Felceta', 'Felceta membership')
  const recipient = contact.email
  const preferences = intent === 'stay' ? [
    [text('Arrivo', 'Arrival'), formatDate(arrival)],
    [text('Partenza', 'Departure'), formatDate(departure)],
    [text('Ospiti', 'Guests'), guests],
    [text('Camera preferita', 'Preferred room'), roomName],
    ['Golf', withGolf ? text('Vorrei aggiungere il golf', 'I would like to include golf') : text('Da concordare', 'To be arranged')],
  ] : intent === 'golf' ? [
    [text('Data preferita', 'Preferred date'), formatDate(arrival)],
    [text('Giocatori', 'Players'), guests],
    [text('Percorso', 'Course'), courseName],
  ] : intent === 'event' ? [
    [text('Data preferita', 'Preferred date'), formatDate(arrival)],
    [text('Partecipanti', 'Guests'), groups.find(item => item.id === attendees)!.label],
    [text('Formato', 'Format'), formats.find(item => item.id === format)!.label],
  ] : [
    [text('Formula di interesse', 'Membership interest'), membership === 'golf' ? 'Felceta Golf' : 'Felceta Country Club'],
  ]
  const subject = `${text('Informazioni', 'Enquiry')} — ${label}`
  const message = [text('Buongiorno,', 'Hello,'), '', text('vorrei ricevere informazioni per le seguenti preferenze:', 'I would like information based on the following preferences:'), '', ...preferences.map(([key, value]) => `${key}: ${value}`), '', text('Potete confermare disponibilità, condizioni e costi?', 'Could you please confirm availability, conditions and rates?'), '', text('Grazie.', 'Thank you.'), '', text('Testo preparato con il sito dimostrativo di Felceta. Non è una prenotazione.', 'Prepared with the Felceta demo website. This is not a booking.')].join('\n')

  const prepare = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const next: Errors = {}
    if (intent !== 'membership') {
      if (!arrival) next.arrival = text('Scegli una data preferita.', 'Choose your preferred date.')
      else if (arrival < today) next.arrival = text('Scegli oggi o una data futura.', 'Choose today or a future date.')
      if (intent === 'stay') {
        if (!departure) next.departure = text('Scegli la data di partenza.', 'Choose your departure date.')
        else if (departure <= arrival) next.departure = text('La partenza deve essere successiva all’arrivo.', 'Departure must be after arrival.')
      }
    }
    setErrors(next)
    if (Object.keys(next).length) {
      document.getElementById(next.arrival ? 'arrival' : 'departure')?.focus()
      return
    }
    setCopyState('idle')
    setSent(false)
    setReady(true)
  }
  const copy = async () => {
    setCopyState('copying')
    try { await navigator.clipboard.writeText(`${subject}\n\n${message}`); setCopyState('copied') }
    catch { setCopyState('error') }
  }
  const changeIntent = (next: Intent) => { setIntent(next); setErrors({}) }
  /* In a real site rooms and tee times would show live availability; here the form collects preferences only. */
  const booking = intent === 'stay' ? { note: text('Camere: la segreteria risponde con disponibilità e prezzi. Usa il modulo anche per gruppi e pacchetti.', 'Rooms: the office replies with availability and rates. Use the form for groups and packages too.') }
    : intent === 'golf' ? { note: text('Tee time: indica giorno e giocatori, la segreteria conferma l’orario.', 'Tee times: give the day and number of players and the office confirms the slot.') }
    : null

  return <div className="enquiry-page page-width"><div className="enquiry-intro"><h1 tabIndex={-1}>{text('Organizza\nla visita.', 'Plan\nyour visit.')}</h1><p>{text('Un soggiorno, una partita o il tuo nuovo club. Partiamo da quello che hai in mente.', 'A stay, a round or your new club. Let’s start with what you have in mind.')}</p><div className="enquiry-intro__photo"><Photo name={intent === 'stay' ? 'villa' : intent === 'golf' ? 'canneti-lake' : intent === 'event' ? 'meeting-room' : 'clubhouse'} alt={intent === 'stay' ? text('Villa Felceta tra gli alberi', 'Villa Felceta among the trees') : intent === 'golf' ? text('Il lago lungo i Canneti', 'The lake along I Canneti') : intent === 'event' ? text('La sala del fienile', 'The barn room') : text('Il salotto della Club House', 'The Club House lounge')} sizes="(max-width: 700px) 100vw, 40vw" /></div><div className="enquiry-contact"><span>{text('Preferisci parlarne?', 'Prefer to talk?')}</span><a href={contact.phoneHref}>{contact.phone}</a></div></div><div className="enquiry-workspace"><ol className="enquiry-steps" aria-label={text('Passaggi della richiesta', 'Enquiry steps')}><li aria-current={!ready ? 'step' : undefined}><span>{ready ? <Check size={13} aria-hidden="true" /> : '1'}</span>{text('Le tue preferenze', 'Your preferences')}</li><li aria-current={ready ? 'step' : undefined}><span>2</span>{text('La tua richiesta', 'Your enquiry')}</li></ol>
      {ready ? <section className="enquiry-result" aria-labelledby="result-title"><h2 id="result-title" ref={resultTitle} tabIndex={-1}>{text('La tua richiesta\nè pronta.', 'Your enquiry\nis ready.')}</h2><p>{text('Controlla il riepilogo. In questa demo l’invio è simulato: nessun messaggio parte davvero.', 'Check the summary. In this demo sending is simulated: no message is actually sent.')}</p><dl className="enquiry-summary">{preferences.map(([key, value]) => <div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}<div><dt>{text('Destinatario', 'Recipient')}</dt><dd>{recipient}</dd></div></dl><div className="enquiry-result__actions"><button className="button button--forest" type="button" onClick={() => setSent(true)} disabled={sent}><Send size={17} aria-hidden="true" />{sent ? text('Richiesta inviata (demo)', 'Enquiry sent (demo)') : text('Invia la richiesta', 'Send enquiry')}</button><button className="copy-button" type="button" onClick={copy} disabled={copyState === 'copying'}>{copyState === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copyState === 'copied' ? text('Testo copiato', 'Text copied') : copyState === 'copying' ? text('Copia in corso…', 'Copying…') : text('Copia la richiesta', 'Copy enquiry')}</button></div><p role="status" className="copy-status">{sent ? text('Invio simulato: nella demo nessun dato lascia il tuo browser.', 'Simulated sending: in the demo no data leaves your browser.') : copyState === 'error' ? text('Copia non disponibile. Seleziona il testo qui sotto.', 'Copy is unavailable. Select the text below.') : copyState === 'copied' ? text('Richiesta copiata.', 'Enquiry copied.') : ''}</p><details className="message-preview"><summary>{text('Leggi il testo completo', 'Read the full message')}</summary><pre>{message}</pre></details><button className="edit-enquiry" type="button" onClick={() => setReady(false)}><Pencil size={15} aria-hidden="true" />{text('Modifica le preferenze', 'Edit preferences')}</button></section>
      : <form noValidate onSubmit={prepare} aria-labelledby="enquiry-form-title"><h2 id="enquiry-form-title" tabIndex={-1} ref={formTitle}>{text('Di cosa\nhai bisogno?', 'What do you\nneed?')}</h2><fieldset className="intent-field"><legend>{text('Vorrei informazioni per', 'I would like information about')}</legend><div className="intent-options">{([{ id: 'stay', label: text('Soggiorno', 'A stay') }, { id: 'golf', label: 'Golf' }, { id: 'event', label: text('Evento', 'An event') }, { id: 'membership', label: 'Membership' }] as const).map(item => <label key={item.id}><input type="radio" name="intent" value={item.id} checked={intent === item.id} onChange={() => changeIntent(item.id)} /><span>{item.label}</span></label>)}</div></fieldset>
        {booking ? <div className="enquiry-booking"><p>{booking.note}</p></div> : null}
        {intent === 'event' ? <div className="field-grid"><div className="field"><label htmlFor="arrival">{text('Data preferita', 'Preferred date')}<span aria-hidden="true"> *</span></label><input id="arrival" type="date" min={today} value={arrival} onChange={event => setArrival(event.target.value)} required aria-invalid={Boolean(errors.arrival)} aria-describedby={errors.arrival ? 'arrival-error' : undefined} />{errors.arrival ? <p id="arrival-error" role="alert" className="field-error">{errors.arrival}</p> : null}</div><div className="field"><label htmlFor="attendees">{text('Partecipanti', 'Guests')}</label><select id="attendees" value={attendees} onChange={event => setAttendees(event.target.value)}>{groups.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div><div className="field field--wide"><label htmlFor="format">{text('Formato', 'Format')}</label><select id="format" value={format} onChange={event => setFormat(event.target.value)}>{formats.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}</select></div></div> : intent !== 'membership' ? <div className="field-grid"><div className="field"><label htmlFor="arrival">{intent === 'stay' ? text('Arrivo preferito', 'Preferred arrival') : text('Data preferita', 'Preferred date')}<span aria-hidden="true"> *</span></label><input id="arrival" type="date" min={today} value={arrival} onChange={event => setArrival(event.target.value)} required aria-invalid={Boolean(errors.arrival)} aria-describedby={errors.arrival ? 'arrival-error' : undefined} />{errors.arrival ? <p id="arrival-error" role="alert" className="field-error">{errors.arrival}</p> : null}</div>{intent === 'stay' ? <div className="field"><label htmlFor="departure">{text('Partenza preferita', 'Preferred departure')}<span aria-hidden="true"> *</span></label><input id="departure" type="date" min={arrival || today} value={departure} onChange={event => setDeparture(event.target.value)} required aria-invalid={Boolean(errors.departure)} aria-describedby={errors.departure ? 'departure-error' : undefined} />{errors.departure ? <p id="departure-error" role="alert" className="field-error">{errors.departure}</p> : null}</div> : null}<div className="field"><label htmlFor="guests">{intent === 'stay' ? text('Numero di ospiti', 'Number of guests') : text('Numero di giocatori', 'Number of players')}</label><select id="guests" value={guests} onChange={event => setGuests(event.target.value)}>{[1, 2, 3, 4, 5, 6, 7, 8].map(number => <option key={number} value={number}>{number}</option>)}</select></div><div className="field field--wide-mobile"><label htmlFor="preference">{intent === 'stay' ? text('Tipologia di camera', 'Room type') : text('Percorso preferito', 'Preferred course')}</label><select id="preference" value={intent === 'stay' ? room : course} onChange={event => intent === 'stay' ? setRoom(event.target.value) : setCourse(event.target.value)}><option value="any">{text('Nessuna preferenza', 'No preference')}</option>{intent === 'stay' ? rooms.map(item => <option key={item.id} value={item.id}>{read(item.name)}</option>) : golfCourses.map(item => <option key={item.slug} value={item.slug}>{item.name}</option>)}</select></div></div> : <div className="field membership-preference"><label htmlFor="membership-preference">{text('La formula che ti interessa', 'The membership you are interested in')}</label><select id="membership-preference" value={membership} onChange={event => setMembership(event.target.value)}><option value="golf">Felceta Golf</option><option value="country">Felceta Country Club</option></select></div>}
        {intent === 'stay' ? <label className="golf-checkbox"><input type="checkbox" checked={withGolf} onChange={event => setWithGolf(event.target.checked)} /><span>{text('Mi interessa abbinare il golf al soggiorno.', 'I am interested in combining golf with my stay.')}</span></label> : null}<p className="form-help">{intent === 'membership' ? text('La segreteria ti aiuterà a scegliere la formula e ti comunicherà le condizioni.', 'The club team will help you choose a membership and explain the conditions.') : intent === 'event' ? text('La sala del fienile accoglie fino a 70 persone sedute. Per gruppi più grandi, il circolo propone la soluzione migliore.', 'The barn room seats up to 70 people. For larger groups, the club suggests the best solution.') : text('Le date sono preferenze, non disponibilità confermate.', 'These are preferred dates, not confirmed availability.')}</p><button type="submit" className="button button--forest">{text('Prepara la richiesta', 'Prepare enquiry')}<Arrow /></button><p className="demo-disclosure">{text('Sito dimostrativo: nessun dato personale richiesto, nessun invio reale e nessuna prenotazione.', 'Demo website: no personal data requested, nothing is really sent and nothing is booked.')}</p></form>}
    </div></div>
}
