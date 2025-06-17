import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { TimerProvider } from './context/timerContext.jsx'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <TimerProvider>
    <App />
    </TimerProvider>
  </StrictMode>,
)
