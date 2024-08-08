import { ChangeEvent, FormEvent, useState } from "react";
import { Button, Form, Stack } from "react-bootstrap";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import {
  generateUUID,
  inverterData,
  validarDataDeNascimento,
} from "../../lib/minhas-funcoes";
import { api } from "../../lib/axios.ts";
import { useMask } from "@react-input/mask";
import {
  ErrosDeCadastroDePaciente,
  Mensagem,
} from "../../lib/minhas-interfaces-e-tipos"

interface FormularioDeCadastroDePacienteProps {
  fecharModalDeCadastro: () => void
  setMensagens: (mensagens: Mensagem[]) => void
  mensagens: Mensagem[]
  emitirMensagemDeAtualizacaoDePacientes: () => void
}

export function FormularioDeCadastroDePaciente({
  fecharModalDeCadastro,
  mensagens,
  setMensagens,
  emitirMensagemDeAtualizacaoDePacientes,
}: FormularioDeCadastroDePacienteProps) {
  const [formularioValidado, setFormularioValidado] = useState(false)
  const [nome, setNome] = useState("")
  const [cpf, setCpf] = useState("")
  const [dataDeNascimento, setDataDeNascimento] = useState<string>("")
  const [telefone, setTelefone] = useState("")
  const [foto, setFoto] = useState("")
  const [botaoCadastrarAtivo, setBotaoCadastrarAtivo] = useState(true)

  const nomeValido = nome.length > 0
  const cpfValido = cpfValidator.isValid(cpf)
  const dataValida = validarDataDeNascimento(dataDeNascimento)
  const telefoneValido = telefone.length === 15
  const fotoValida = foto.length > 0

  const cpfRef = useMask({ mask: "___.___.___-__", replacement: { _: /\d/ } })
  const dataRef = useMask({
    mask: "dd/mm/aaaa",
    replacement: { d: /\d/, m: /\d/, a: /\d/ },
  })
  const telefoneRef = useMask({
    mask: "(__) 9____-____",
    replacement: { _: /\d/ },
  })

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormularioValidado(true)

    if (!nomeValido) {
      return
    }

    if (!cpfValido) {
      return
    }

    if (!dataValida) {
      return
    }

    if (!telefoneValido) {
      return
    }

    if (!fotoValida) {
      return
    }

    setBotaoCadastrarAtivo(false)

    const formulario = event.currentTarget
    const dados = new FormData(formulario)

    dados.set("data_de_nascimento", dataDeNascimento)

    api
    .post("pacientes", dados)
      .then((resposta) => {
        setMensagens([
          [resposta.data.mensagem, "sucesso", generateUUID()],
          ...mensagens,
        ])
        setBotaoCadastrarAtivo(true)
        fecharModalDeCadastro()
        emitirMensagemDeAtualizacaoDePacientes()
      })
      .catch((resposta) => {
        const erros: ErrosDeCadastroDePaciente = resposta.response.data.errors;

        let novasMensagens: Mensagem[] = []

        for (const mensagensDeErro of Object.values(erros)) {
          const novasMensagensDeErro = mensagensDeErro.map(
            (mensagemDeErro: string) => {
              return [mensagemDeErro, "erro", generateUUID()]
            }
          )

          novasMensagens = [...novasMensagens, ...novasMensagensDeErro]
        }

        setMensagens([...novasMensagens, ...mensagens])
        fecharModalDeCadastro()
      })
  }

  function handleDataDeNascimentoChange(event: ChangeEvent<HTMLInputElement>) {
    const dataDeNascimento = inverterData(event.target.value, "/")
    setDataDeNascimento(dataDeNascimento)
  }

  return (
    <Form
      noValidate
      className="p-4 bg-secondary-subtle rounded-2"
      onSubmit={handleSubmit}
    >
      <Stack gap={2} className="mb-3">
        <div>
          <Form.Group className="" controlId="nome_input">
            <Form.Label>Nome do Paciente:</Form.Label>
            <Form.Control
              autoFocus
              required
              type="text"
              name="nome"
              placeholder="Insira seu nome aqui"
              onChange={(event) => setNome(event.target.value)}
              isValid={nomeValido && formularioValidado}
              isInvalid={!nomeValido && formularioValidado}
            />
            <Form.Control.Feedback type="invalid">
              Nome obrigatório!
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div>
          <Form.Group controlId="cpf_input">
            <Form.Label>CPF:</Form.Label>
            <Form.Control
              name="cpf"
              type="text"
              ref={cpfRef}
              placeholder="000.000.000-00"
              onChange={(event) => setCpf(event.target.value)}
              isValid={cpfValido && formularioValidado}
              isInvalid={!cpfValido && formularioValidado}
            />
            <Form.Control.Feedback type="valid">
              CPF válido!
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid">
              CPF inválido!
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div>
          <Form.Group controlId="data_de_nascimento_input">
            <Form.Label>Data de Nascimento:</Form.Label>
            <Form.Control
              name="data_de_nascimento"
              type="text"
              ref={dataRef}
              placeholder="dd/mm/aaaa"
              isValid={dataValida && formularioValidado}
              isInvalid={!dataValida && formularioValidado}
              onChange={handleDataDeNascimentoChange}
            />
            <Form.Control.Feedback type="invalid">
              Data de nascimento inválida!
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div>
          <Form.Group controlId="telefone_input">
            <Form.Label>Telefone:</Form.Label>
            <Form.Control
              name="telefone"
              type="text"
              ref={telefoneRef}
              placeholder="(00) 90000-0000"
              onChange={(event) => setTelefone(event.target.value)}
              isValid={telefoneValido && formularioValidado}
              isInvalid={!telefoneValido && formularioValidado}
            />
            <Form.Control.Feedback type="invalid">
              Telefone inválido!
            </Form.Control.Feedback>
          </Form.Group>
        </div>
        <div>
          <Form.Group controlId="foto_group">
            <Form.Label>Foto do Paciente:</Form.Label>
            <Form.Control
              name="foto"
              type="file"
              accept=".jpg, .png, .jpeg"
              onChange={(event) => setFoto(event.target.value)}
              isValid={fotoValida && formularioValidado}
              isInvalid={!fotoValida && formularioValidado}
            />
            <Form.Control.Feedback type="invalid">
              Foto Obrigatória
            </Form.Control.Feedback>
          </Form.Group>
        </div>
      </Stack>
      <Button className="me-3" type="submit" disabled={!botaoCadastrarAtivo}>
        {botaoCadastrarAtivo ? "Cadastrar" : "Cadastrando..."}
      </Button>
      <Button 
        onClick={fecharModalDeCadastro} 
        variant="secondary" 
        disabled={!botaoCadastrarAtivo}>
        Cancelar
      </Button>
    </Form>
  );
}
