import { Modal } from "react-bootstrap";
import { FormularioDeCadastroDePaciente } from "./formulario-de-cadastro-de-paciente";
import { Mensagem } from "../../lib/minhas-interfaces-e-tipos";

interface ModalDeCadastroDePacienteProps {
  modalDeCadastroAberto: boolean
  fecharModalDeCadastro: () => void
  setMensagens: (mensagens: Mensagem[]) => void
  mensagens: Mensagem[]
  setMensagemDeErro: (mensagen: string) => void
}

export function ModalDeCadastroDePaciente({
  modalDeCadastroAberto,
  fecharModalDeCadastro,
  mensagens,
  setMensagens,
  setMensagemDeErro,
}: ModalDeCadastroDePacienteProps) {
  return (
    <Modal
      backdrop="static"
      centered
      size="lg"
      show={modalDeCadastroAberto}
      onHide={fecharModalDeCadastro}
    >
      <Modal.Header>
        <Modal.Title>Formulário de Cadastro de Paciente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <FormularioDeCadastroDePaciente
          fecharModalDeCadastro={fecharModalDeCadastro}
          mensagens={mensagens}
          setMensagens={setMensagens}
          setMensagemDeErro={setMensagemDeErro}
        />
      </Modal.Body>
    </Modal>
  );
}
