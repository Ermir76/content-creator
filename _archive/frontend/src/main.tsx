import './style.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'
import App from './App.tsx'

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
