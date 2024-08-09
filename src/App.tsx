import "bootstrap/dist/css/bootstrap.min.css"
import { PaginaPrincipal } from './pages/pagina-principal'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PaginaDoPaciente } from './pages/pagina-do-paciente'
import { useState } from "react"

export function App() {
  const [mensagemDeErroDeRequisicao, setMensagemDeErroDeRequisicao] = useState("")
  
  const router = createBrowserRouter([
    {
      path: "/",
      element: <PaginaPrincipal />
    },
    {
      path: 'paciente/:pacienteId',
      element: <PaginaDoPaciente />
    }
  ])


  return (
    <main 
      className="conteiner-fluid mx-auto px-4 py-5"
      style={{
        maxWidth: "1400px"
      }}
    >
      <RouterProvider router={router} />
    </main>
    
  )
}

