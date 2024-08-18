import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import Pusher from 'pusher-js'
Pusher.logToConsole = true

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
