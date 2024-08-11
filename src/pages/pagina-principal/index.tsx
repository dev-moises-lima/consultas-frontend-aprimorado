import { useContext, useEffect, useState } from "react"
import { ModalDeCadastroDePaciente } from "./modal-de-cadastro-de-paciente"
import { TabelaDePacientes } from "./tabela-de-pacientes"
import { Button } from "react-bootstrap"
import { api } from "../../lib/axios.ts"
import { Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos"
import { Notificacao } from "../../components/notificacao"
import { AxiosError } from "axios"
import { obterMensagemDeErro } from "../../lib/minhas-funcoes.ts"
import { AppContext } from "../../context/AppContext.tsx"


export function PaginaPrincipal() {
  const { mensagemDeErroFatal, mudarMensagemDeErroFatal } = useContext(AppContext)
  const [modalDeCadastroAberto, setModalDeCadastroAberto] = useState(false)
  const [controleDeAtualizacaoDePacientes,setControleDeAtualizacaoDePacientes] = useState(false)
  const [pacientes, setPacientes] = useState<Paciente[]>()
  const [mensagens, setMensagens] = useState<Mensagem[]>([])
  
  async function obterPacientes() {
    try {
      const resposta = await api.get("pacientes")
      setPacientes(resposta.data)
      console.log(mensagemDeErroFatal)
      
      mudarMensagemDeErroFatal("")
      console.log(resposta)
    } catch (erro) {
      console.log(erro)
      const axiosError = erro as AxiosError
      
      mudarMensagemDeErroFatal(obterMensagemDeErro(axiosError))

      setTimeout(() => {
        obterPacientes()
      }, 3000)
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
        setMensagemDeErro={mudarMensagemDeErroFatal}
      />
      <TabelaDePacientes pacientes={pacientes} />
    </>
  );
}

