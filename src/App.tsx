import "bootstrap/dist/css/bootstrap.min.css"
import { PaginaPrincipal } from './pages/pagina-principal'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PaginaDoPaciente } from './pages/pagina-do-paciente'
import { useState } from "react"
import { ModalDeNotificacaoDeErro } from "./components/modal-de-notificacao-de-erro"

export function App() {
  const [mensagemDeErro, setMensagemDeErro] = useState("")
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PaginaPrincipal setMensagemDeErro={setMensagemDeErro}/>
    },
    {
      path: 'paciente/:pacienteId',
      element: <PaginaDoPaciente setMensagemDeErro={setMensagemDeErro}/>
    }
  ])

  return (
    <main 
      className="conteiner-fluid mx-auto px-4 py-4"
      style={{
        maxWidth: "1400px"
      }}
    >
      <RouterProvider router={router} />
      {mensagemDeErro && (
        <ModalDeNotificacaoDeErro>
          {mensagemDeErro}
        </ModalDeNotificacaoDeErro>
      )}
    </main>
  )
}

