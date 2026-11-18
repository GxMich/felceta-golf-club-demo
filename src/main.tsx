import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/albert-sans/latin-400.css'
import '@fontsource/albert-sans/latin-500.css'
import '@fontsource/cormorant-garamond/latin-300.css'
import '@fontsource/cormorant-garamond/latin-400.css'
import '@fontsource/cormorant-garamond/latin-300-italic.css'
import '@fontsource/cormorant-garamond/latin-400-italic.css'
import App from './App'
import './styles/global.css'

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
