import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { BiPlus } from "react-icons/bi";
import { GrReturn } from "react-icons/gr";
import { FormularioDeConsulta } from "./formulario-de-consulta";
import { InfoPaciente } from "./info-paciente";
import { TabelaDeConsultas } from "./tabela-de-consultas";
import { Consulta, Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos";
import { api } from "../../lib/axios";
import { useNavigate, useParams } from "react-router-dom";
import { Notificacao } from "../../components/notificacao";
import { AxiosError } from "axios";

export function PaginaDoPaciente() {
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [exibindoFormularioDeConsulta, setMostrarFormularioDeConsulta] = useState(false)
  const [paciente, setPaciente] = useState<Paciente>()
  const [pacienteExiste, setPacienteExiste] = useState(true)
  const [consultas, setConsultas] = useState<Consulta[]>()
  const [controleDeAtualizacaoDoPaciente, setControleDeAtualizacaoDoPaciente] = useState(false)
  const { pacienteId } = useParams()
  const navigate = useNavigate()

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

  useEffect(() => {
    async function obterPaciente() {
      try {
        const resposta = await api.get(`pacientes/${pacienteId}`)
  
        setPaciente(resposta.data)
  
      } catch (erro) {
        setPacienteExiste(false)
  
        setTimeout(() => {
          navigate("/")
        }, 3000)
  
        console.log(erro)
      }
    }
    
    async function obterConsultas() {
      try {
        const resposta = await api.get(`pacientes/${pacienteId}/consultas`)
        setConsultas(resposta.data)
      } catch (erro: any) {
        const axiosError: AxiosError = erro
        console.log(axiosError.request)
      }
    }

    obterPaciente()
    obterConsultas()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controleDeAtualizacaoDoPaciente])

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
          />

          {exibindoFormularioDeConsulta ? 
              <FormularioDeConsulta
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
                  as="a" 
                  href="/" 
                  size="lg">
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
        <div className="p-3 p-md-4 bg-secondary-subtle rounded-2 mt-4">
          <h1 className="text-info text-center">
            {pacienteExiste ? "Carregando dados do paciente..." : "O paciente com o id " + pacienteId + " não existe."}
          </h1>
        </div>
      )}
    </>
  )
}


