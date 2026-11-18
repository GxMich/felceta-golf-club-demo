# Felceta Golf & Country Club — sito dimostrativo

> **Attività di fantasia.** Felceta Golf & Country Club e il paese di Colle Albero non esistono. Nomi, recapiti,
> prezzi, percorsi, distanze e testi sono inventati. Il sito è una demo realizzata da
> [Michele Modica](https://www.modicamichele.it) per mostrare il proprio lavoro.

Demo online: https://gxmich.github.io/felceta-golf-club-demo/

## Cosa mostra la demo

- **Home** con foto a tutto schermo, ora e meteo in tempo reale (Open-Meteo, senza chiavi né cookie) e un
  pianificatore della visita: golf, soggiorno, evento o membership.
- **Due percorsi da 18 buche** con confronto a schede, pagina dedicata per ciascuno ed esploratore buca per buca:
  schema della buca disegnato in SVG a partire dai dati, distanze dalle quattro partenze, consiglio di gioco,
  navigazione da tastiera e con lo swipe, score card completa con i totali calcolati.
- **Ospitalità** con filtro per edificio, scelta della camera e galleria.
- **Eventi** e **membership** con le loro richieste dedicate.
- **Richiesta guidata** in due passaggi: validazione delle date, riepilogo modificabile, copia del testo.
  L'invio è **simulato**: nessun dato lascia il browser e niente viene prenotato.
- Italiano e inglese, navigazione mobile con menu a tutto schermo e barra d'azione in basso, animazioni GSAP
  disattivate con `prefers-reduced-motion`.
- `noindex, nofollow` su ogni pagina e `robots.txt` con `Disallow: /`.

## Tecnologie

React 19, TypeScript, Vite, React Router, GSAP (ScrollTrigger), lucide-react, font Cormorant Garamond e
Albert Sans via Fontsource. Pubblicazione su GitHub Pages con GitHub Actions.

## Avvio in locale

Serve Node 20.19 o successivo.

```bash
npm ci
npm run dev
```

Build di produzione e anteprima:

```bash
npm run build
npm run preview
```

La build usa il percorso base `/felceta-golf-club-demo/` (vedi `vite.config.ts`).

## Foto

Tutte le foto vengono da Unsplash con la relativa licenza: l'elenco completo è in [CREDITI-FOTO.md](CREDITI-FOTO.md).
