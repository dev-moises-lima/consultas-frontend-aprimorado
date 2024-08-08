import { ItemDaTabelaPacientes } from "./item-da-tabela-pacientes";
import { Paciente } from "../../lib/minhas-interfaces-e-tipos";
import { Col, Form, InputGroup, Row, Table } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { useState } from "react";
import { normalizar } from "../../lib/minhas-funcoes";

interface TabelaDePacientesProps {
  pacientes: Paciente[] | undefined
}

export function TabelaDePacientes({ pacientes }: TabelaDePacientesProps) {
  const [filtro, setFiltro] = useState("")

  let pacientesFiltrados: Paciente[] = []

  if (pacientes) {
    pacientesFiltrados = pacientes.slice()
  }

  if (filtro) {
    pacientesFiltrados = pacientesFiltrados.filter((paciente) => {
      return normalizar(paciente.nome).includes(filtro)
    })
  }

  return (
    <div className="p-3 p-md-4 bg-secondary-subtle rounded-2 mt-4">
      {pacientes === undefined ? (
        <h2 className="text-center text-info">Carregando Pacientes...</h2>
      ) : pacientes.length === 0 ? (
        <h2 className="text-center text-info">Nenhum paciente cadastrado</h2>
      ) : (
        <>
          <Row className="mb-4">
            <Col xs={4}>
              <InputGroup>
                <Form.Control
                  className="col-2"
                  placeholder="Pesquisar por nome"
                  aria-label="Pesquisar"
                  name="filtro"
                  onChange={(event) =>
                    setFiltro(normalizar(event.target.value))
                  }
                />
                <InputGroup.Text>
                  <IoIosSearch className="text-primary fs-5" />
                </InputGroup.Text>
              </InputGroup>
            </Col>
          </Row>
          <Table className="m-0" striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome completo do Paciente</th>
                <th>Condição</th>
                <th>CPF</th>
                <th>Idade</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pacientesFiltrados.reverse().map((paciente) => (
                <ItemDaTabelaPacientes key={paciente.id} paciente={paciente} />
              ))}
            </tbody>
          </Table>
        </>
      )}
    </div>
  );
}
