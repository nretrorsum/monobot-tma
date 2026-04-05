import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initTelegramApp } from './lib/telegram'
import App from './App'
import './styles/index.css'

initTelegramApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
