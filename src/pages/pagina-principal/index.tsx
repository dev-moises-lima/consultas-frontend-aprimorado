import { useEffect, useState } from "react";
import { ModalDeCadastroDePaciente } from "./modal-de-cadastro-de-paciente";
import { TabelaDePacientes } from "./tabela-de-pacientes";
import { Button } from "react-bootstrap";
import { api } from "../../lib/axios.ts";
import { ErroDeRequisicao, Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos";
import { Notificacao } from "../../components/notificacao";
import { AxiosError } from "axios";
import { ModalDeNotificacaoDeErro } from "../../components/modal-notificacao-de-erro.tsx";

interface PaginaPrincipalProps
{
  setMensagemDeErroDeRequisicao: (mensagem: string) => void
  mensagem: string
}

export function PaginaPrincipal() {
  const [modalDeCadastroAberto, setModalDeCadastroAberto] = useState(false)
  const [controleDeAtualizacaoDePacientes,setControleDeAtualizacaoDePacientes] = useState(false)
  const [pacientes, setPacientes] = useState<Paciente[]>()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  const [mensagemDeErroDeRequisicao, setMensagemDeErroDeRequisicao] = useState("")

  async function obterPacientes() {
    try {
      const resposta = await api.get("pacientes")
      setPacientes(resposta.data)
      setMensagemDeErroDeRequisicao("")
      console.log(resposta)
    } catch (erro: any) {
      const axiosError: AxiosError = erro
      const codigoDeErro = axiosError.code

      switch(codigoDeErro)
      {
        case "ERR_BAD_REQUEST":
          setMensagemDeErroDeRequisicao("Recursos não encontrados no servidor")
          break
        case "ERR_BAD_RESPONSE":
          setMensagemDeErroDeRequisicao("Erro interno do servidor")
          break
        case "ERR_NETWORK":
          setMensagemDeErroDeRequisicao("Erro de conexão com o servidor")
          break
        default:
          setMensagemDeErroDeRequisicao(codigoDeErro!)
      }

      setTimeout(() => {
        obterPacientes()
      }, 5000)
    }
  }

  useEffect(() => {
    obterPacientes()
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
      />
      <TabelaDePacientes pacientes={pacientes} />
      {mensagemDeErroDeRequisicao && (
        <ModalDeNotificacaoDeErro>
          {mensagemDeErroDeRequisicao}
        </ModalDeNotificacaoDeErro>
      )}
    </>
  );
}
