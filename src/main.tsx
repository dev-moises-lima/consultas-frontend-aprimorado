import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App.tsx'
import { AppProvider } from './context/AppContext.tsx'
import Pusher from 'pusher-js'
import Echo from "laravel-echo"

Pusher.logToConsole = true

window.Echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY, // A chave da sua aplicação Pusher
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER, // O cluster do Pusher (geralmente 'mt1')
  forceTLS: true,
  encrypted: true,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>,
)
