import { Col, Row, Image, Stack, Badge, Placeholder } from "react-bootstrap";
import { CondicaoDoPaciente, Paciente } from "../../lib/minhas-interfaces-e-tipos";
import moment from "moment";
import { useState } from "react";
import { obterCorDaCondicao } from "../../lib/minhas-funcoes";

interface InfoPacienteProps {
  paciente: Paciente
}

export function InfoPaciente({
  paciente
} : InfoPacienteProps) {
  const [fotoCarregada, setFotoCarregada] = useState(false)
  const hoje = moment()
  const dataDeNascimento = moment(paciente.data_de_nascimento, "YYYY/MM/DD")
  const idadeDoPaciente = hoje.diff(dataDeNascimento, "year")

  const condicaoDoPaciente: CondicaoDoPaciente = paciente.condicao_atual

  const corDaCondicao = obterCorDaCondicao(condicaoDoPaciente)
  
  
  return (
    <section className="p-3 bg-info-subtle rounded-2">
      <Row className="align-items-center">
        <Col xs={9} className="border-3">
        <Stack gap={3}>
          <Row>
            <Col>
              <div className="fs-5 text-info">
                Nome Do paciente
              </div>
              <div className="fs-4 fw-semibold">
                {paciente.nome}
              </div>
            </Col>
            <Col>
              <div className="fs-5 text-info">
                ID
              </div>
              <div className="fs-4">
                <Badge >
                  {paciente.id}
                </Badge>
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="fs-5 text-info">
                Idade
              </div>
              <div className="fs-4 fw-semibold">
                {idadeDoPaciente}
              </div>
            </Col>
            <Col>
              <div className="fs-5 text-info">
                Resultado da Última Consulta
              </div>
              <div className={`fs-4 text-${corDaCondicao} fw-semibold`}>
                {condicaoDoPaciente || "Nenhuma consulta realizada"}
              </div>
            </Col>
          </Row>
          <Row>
            <Col>
              <div className="fs-5 text-info">
                CPF
              </div>
              <div className="fs-4 fw-semibold">
                {paciente.cpf}
              </div>
            </Col>
            <Col>
              <div className="fs-5 text-info">
                Telefone
              </div>
              <div className="fs-4 fw-semibold">
                {paciente.telefone}
              </div>
            </Col>
          </Row>
        </Stack>
        </Col>
        <Col>
          <Placeholder
            className={`bg-transparent d-${fotoCarregada ? "none" : "block"}`}>
            <Image
              fluid
              roundedCircle
              src="https://placehold.co/300x300?text=Foto"
              aria-hidden="true"
            />
          </Placeholder>
          <Image
            className={`d-${fotoCarregada ? "block" : "none"}`}
            roundedCircle
            fluid
            src={paciente.foto}
            onLoad={() => setFotoCarregada(true)}
          />
        </Col>
      </Row>
    </section>
  )
}