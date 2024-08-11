import "bootstrap/dist/css/bootstrap.min.css"
import { PaginaPrincipal } from './pages/pagina-principal'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PaginaDoPaciente } from './pages/pagina-do-paciente'
import { useContext } from "react"
import { ModalDeNotificacaoDeErro } from "./components/modal-de-notificacao-de-erro"
import { AppContext } from "./context/AppContext"

export function App() {
  const { mensagemDeErroFatal } = useContext(AppContext)
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PaginaPrincipal/>
    },
    {
      path: 'paciente/:pacienteId',
      element: <PaginaDoPaciente/>
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
      {mensagemDeErroFatal && (
        <ModalDeNotificacaoDeErro>
          {mensagemDeErroFatal}
        </ModalDeNotificacaoDeErro>
      )}
    </main>
  )
}

