import { useContext, useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap"
import { BiPlus } from "react-icons/bi"
import { GrReturn } from "react-icons/gr"
import { FormularioDeConsulta } from "./formulario-de-consulta"
import { InfoPaciente } from "./info-paciente"
import { TabelaDeConsultas } from "./tabela-de-consultas"
import { Consulta, Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos"
import { api } from "../../lib/axios"
import { useNavigate, useParams } from "react-router-dom"
import { Notificacao } from "../../components/notificacao"
import { AxiosError } from "axios"
import { obterMensagemDeErro } from "../../lib/minhas-funcoes"
import { AppContext } from "../../context/AppContext"

export function PaginaDoPaciente() {
  const { mudarMensagemDeErroFatal } = useContext(AppContext)
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [exibindoFormularioDeConsulta, setMostrarFormularioDeConsulta] = useState(false)
  const [paciente, setPaciente] = useState<Paciente>()
  const [pacienteExiste, setPacienteExiste] = useState(true)
  const [consultas, setConsultas] = useState<Consulta[]>()
  const [controleDeAtualizacaoDoPaciente, setControleDeAtualizacaoDoPaciente] = useState(false)
  const { pacienteId } = useParams()
  const navigate = useNavigate()
  const formularioRef = useRef(null)
  const infoPacienteRef = useRef(null)


  if(!pacienteExiste) {
    setTimeout(() => {
      navigate("/")
    }, 3000)
  }

  function rolarParaInfoPaciente() {
    if(infoPacienteRef.current) {
      console.log(infoPacienteRef);
      
      const sessaoInfoPaciente = infoPacienteRef.current as HTMLTableSectionElement
      sessaoInfoPaciente.scrollIntoView({behavior: "smooth"})
    }
  }

  function rolarParaSessaoDoFormulario() {
    if(formularioRef.current) {
      console.log(formularioRef)
      const sessaoDoFormulario = formularioRef.current as HTMLTableSectionElement
      sessaoDoFormulario.scrollIntoView({behavior: "smooth"})
    }
  }

  useEffect(() => {
    if(exibindoFormularioDeConsulta) {
      rolarParaSessaoDoFormulario()
    } else {
      rolarParaInfoPaciente()
    }
  }, [exibindoFormularioDeConsulta])

  function exibirFormularioDeConsulta() {
    setMostrarFormularioDeConsulta(true)
  }

  function esconderFormularioDeConsulta() {
    setMostrarFormularioDeConsulta(false)
  }
  
  function removerMensagem(codigoDaMensagem: string) {
    setMensagens(mensagens.filter((mensagen) => mensagen[2] !== codigoDaMensagem))
  }

  function adicionarMensagem(mensagem: Mensagem) {
    setMensagens([...mensagens, mensagem])
  }

  function emitirMensagemDeAtualizacaoDoPaciente() {
    setControleDeAtualizacaoDoPaciente(!controleDeAtualizacaoDoPaciente)
  }

  async function obterPaciente() {
    try {
      const resposta = await api.get(`pacientes/${pacienteId}`)
      setPaciente(resposta.data)
      mudarMensagemDeErroFatal("")
      obterConsultas()
    } catch (erro) {      
      const axiosError = erro as AxiosError
      
      if(axiosError.code == "ERR_BAD_REQUEST" && axiosError.response?.status == 400) {
        setPacienteExiste(false)
      } else {
        mudarMensagemDeErroFatal(obterMensagemDeErro(axiosError))
        setTimeout(() => {
          obterPaciente()
        }, 3000)
      }
    }
  }
  
  async function obterConsultas() {
    try {
      const resposta = await api.get(`pacientes/${pacienteId}/consultas`)
      mudarMensagemDeErroFatal("")
      setConsultas(resposta.data)
    } catch (erro) {
      const axiosError = erro as AxiosError
      
      if(axiosError.code == "ERR_BAD_REQUEST" && axiosError.response?.status == 400) {
        setPacienteExiste(false)
      } else {
        mudarMensagemDeErroFatal(obterMensagemDeErro(axiosError))
        setTimeout(() => {
          obterPaciente()
        }, 3000)
      }
    }
  }

  useEffect(() => {
    obterPaciente()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controleDeAtualizacaoDoPaciente, pacienteId])


  return (
    <>
      {mensagens && mensagens.slice().reverse().map(mensagem => (
        <Notificacao
          onClose={() => removerMensagem(mensagem[2])}
          variante={mensagem[1]}
          key={mensagem[2]}
        >
          {mensagem[0]}
        </Notificacao>
      ))}
      {paciente ? (
        <>
          <InfoPaciente 
            paciente={paciente}
            sectionRef={infoPacienteRef}
          />

          {exibindoFormularioDeConsulta ? 
              <FormularioDeConsulta
                rolarParaSessaoDoFormulario={rolarParaSessaoDoFormulario}

                formularioRef={formularioRef}
                adicionarMensagem={adicionarMensagem}
                emitirMensagemDeAtualizacaoDoPaciente={emitirMensagemDeAtualizacaoDoPaciente}
                esconderFormularioDeConsulta={esconderFormularioDeConsulta}
                pacienteId={pacienteId!}
                mensagens={mensagens}
                setMensagens={setMensagens}
              />
            : (
              <div className="p-3 mt-3 bg-secondary-subtle justify-content-between d-flex">
                <Button 
                  onClick={() => navigate("/")}
                  size="lg"
                >
                  Voltar <GrReturn />
                </Button>

                <Button 
                  onClick={exibirFormularioDeConsulta} 
                  size="lg">
                  Cadastrar nova consulta <BiPlus/>
                </Button>
              </div>
            )
          }
          <TabelaDeConsultas 
            consultas={consultas}
          />
        </>
      ) : (
        <div className="p-4 bg-secondary-subtle rounded-2">
          <h1 className="text-info text-center">
            {pacienteExiste ? "Carregando dados do paciente..." : `O paciente com o id ${pacienteId} não existe`}
          </h1>
        </div>
      )}
    </>
  )
}


