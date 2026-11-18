/* Demo contacts: every value is fictitious. Nothing in this demo sends data or books anything. */
export const contact = {
  name: 'Felceta Golf & Country Club',
  phone: '+39 000 000 0000',
  phoneHref: 'tel:+390000000000',
  email: 'info@felceta-golf-club.example',
  address: 'Strada della Felceta 4',
  town: 'Colle Albero (Piemonte)',
} as const

/* Tee times and rooms would live on a booking system; in the demo they lead to the enquiry, prefilled. */
export function teeTimeUrl(date?: string) {
  const params = new URLSearchParams({ intent: 'golf' })
  if (date) params.set('arrival', date)
  return `/richiesta?${params}`
}

export function roomsUrl(arrival?: string) {
  const params = new URLSearchParams({ intent: 'stay' })
  if (arrival) params.set('arrival', arrival)
  return `/richiesta?${params}`
}
