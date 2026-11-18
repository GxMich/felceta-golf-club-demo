import { useEffect, useState } from 'react'
import { useSite } from '../lib/site'

type Weather = { temperature: number; code: number; wind: number; sunset: string }

/* Live conditions for the demo location (approximate coordinates in Piedmont) from Open-Meteo (no key, no cookies). Fetched once per visit; the local time works without it. */
const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=45.20&longitude=7.70&current=temperature_2m,weather_code,wind_speed_10m&daily=sunset&timezone=Europe%2FRome&forecast_days=1'
let request: Promise<Weather | null> | null = null
const loadWeather = () => request ??= fetch(endpoint)
  .then(response => response.ok ? response.json() : null)
  .then(data => data?.current ? { temperature: Math.round(data.current.temperature_2m), code: data.current.weather_code, wind: Math.round(data.current.wind_speed_10m), sunset: String(data.daily?.sunset?.[0] || '').slice(11, 16) } : null)
  .catch(() => null)

export default function Conditions({ className = '' }: { className?: string }) {
  const { text, locale } = useSite()
  const [weather, setWeather] = useState<Weather | null>(null)
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    let active = true
    loadWeather().then(result => { if (active) setWeather(result) })
    const timer = window.setInterval(() => setNow(new Date()), 30000)
    return () => { active = false; window.clearInterval(timer) }
  }, [])
  const sky = (code: number) => code === 0 ? text('Sereno', 'Clear') : code <= 2 ? text('Poco nuvoloso', 'Partly cloudy') : code === 3 ? text('Nuvoloso', 'Overcast') : code <= 48 ? text('Nebbia', 'Fog') : code <= 57 ? text('Pioviggine', 'Drizzle') : code <= 67 ? text('Pioggia', 'Rain') : code <= 77 ? text('Neve', 'Snow') : code <= 82 ? text('Rovesci', 'Showers') : code <= 86 ? text('Neve', 'Snow') : text('Temporale', 'Thunderstorm')
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Rome' }).format(now)
  return <dl className={`conditions ${className}`} aria-label={text('Condizioni attuali a Colle Albero', 'Current conditions at Colle Albero')}>
    <div><dt>{text('Ora a Colle Albero', 'Time at Colle Albero')}</dt><dd>{time}</dd></div>
    {weather ? <>
      <div><dt>{sky(weather.code)}</dt><dd>{weather.temperature}°</dd></div>
      <div className="conditions__extra"><dt>{text('Vento', 'Wind')}</dt><dd>{weather.wind}<small> km/h</small></dd></div>
      {weather.sunset ? <div className="conditions__extra"><dt>{text('Tramonto', 'Sunset')}</dt><dd>{weather.sunset}</dd></div> : null}
    </> : null}
  </dl>
}
