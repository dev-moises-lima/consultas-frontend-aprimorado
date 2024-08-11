import { useEffect, useState } from "react"
import { ModalDeCadastroDePaciente } from "./modal-de-cadastro-de-paciente"
import { TabelaDePacientes } from "./tabela-de-pacientes"
import { Button } from "react-bootstrap"
import { api } from "../../lib/axios.ts"
import { Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos"
import { Notificacao } from "../../components/notificacao"
import { AxiosError } from "axios"

interface PaginaPrincipalProps
{
  setMensagemDeErro: (mensagem: string) => void
}

export function PaginaPrincipal({
  setMensagemDeErro,
}: PaginaPrincipalProps) {
  const [modalDeCadastroAberto, setModalDeCadastroAberto] = useState(false)
  const [controleDeAtualizacaoDePacientes,setControleDeAtualizacaoDePacientes] = useState(false)
  const [pacientes, setPacientes] = useState<Paciente[]>()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  
  async function obterPacientes() {
    try {
      const resposta = await api.get("pacientes")
      setPacientes(resposta.data)
      setMensagemDeErro("")
      console.log(resposta)
    } catch (erro) {
      console.log(erro);
      
      const axiosError = erro as AxiosError
      const codigoDeErro = axiosError.code

      switch(codigoDeErro)
      {
        case "ERR_BAD_REQUEST":
          setMensagemDeErro("Recursos não encontrados no servidor")
          break
        case "ERR_BAD_RESPONSE":
          setMensagemDeErro("Erro na resposta do servidor")
          break
        case "ERR_NETWORK":
          setMensagemDeErro("Erro de conexão com o servidor")
          break
        default:
          setMensagemDeErro(axiosError.message)
      }

      setTimeout(() => {
        obterPacientes()
      }, 5000)
    }
  }

  useEffect(() => {
    obterPacientes()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controleDeAtualizacaoDePacientes])

  function removerMensagem(codigoDaMensagem: string) {
    setMensagens(
      mensagens.filter((mensagen) => mensagen[2] !== codigoDaMensagem)
    )
  }

  function fecharModalDeCadastro() {
    setModalDeCadastroAberto(false)
  }

  function abrirModalDeCadastro() {
    setModalDeCadastroAberto(true)
  }

  function emitirMensagemDeAtualizacaoDePacientes() {
    setControleDeAtualizacaoDePacientes(!controleDeAtualizacaoDePacientes)
  }

  return (
    <>
      {mensagens &&
        mensagens.map((mensagem) => (
          <Notificacao
            onClose={() => removerMensagem(mensagem[2])}
            variante={mensagem[1]}
            key={mensagem[2]}
          >
            {mensagem[0]}
          </Notificacao>
        ))}
      <div className="conteiner p-3 p-md-4 bg-info-subtle rounded-2">
        <Button size="lg" onClick={abrirModalDeCadastro}>
          Cadastrar Paciente
        </Button>
      </div>
      <ModalDeCadastroDePaciente
        modalDeCadastroAberto={modalDeCadastroAberto}
        fecharModalDeCadastro={fecharModalDeCadastro}
        emitirMensagemDeAtualizacaoDePacientes={
          emitirMensagemDeAtualizacaoDePacientes
        }
        mensagens={mensagens}
        setMensagens={setMensagens}
        setMensagemDeErro={setMensagemDeErro}
      />
      <TabelaDePacientes pacientes={pacientes} />
    </>
  );
}
