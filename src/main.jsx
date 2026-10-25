import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/fonts.css'
import './styles/tokens.css'
import './styles/global.css'
import './styles/shared.css'
import './styles/accessibility.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Registra o service worker do PWA (public/sw.js).
// Só em produção: no modo de desenvolvimento os arquivos mudam a cada
// salvamento e o cache atrapalharia. O manifest continua valendo no dev.
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .catch((erro) => console.warn('Service worker não registrado:', erro))
  })
}
