import moment from "moment";
import { Paciente } from "../../lib/minhas-interfaces-e-tipos";
import { Button } from "react-bootstrap";
import { FaArrowRight } from "react-icons/fa";
import { obterCorDaCondicao } from "../../lib/minhas-funcoes";

interface ItemDaTabelaPacientesProps {
  paciente: Paciente
}

export function ItemDaTabelaPacientes({
  paciente,
}: ItemDaTabelaPacientesProps) {
  const hoje = moment()
  const dataDeNascimento = moment(paciente.data_de_nascimento, "YYYY/MM/DD")
  const idadeDoPaciente = hoje.diff(dataDeNascimento, "year")
  const corDaCondicao = obterCorDaCondicao(paciente.condicao_atual)

  return (
    <tr>
      <td className="align-middle">{paciente.id}</td>
      <td className="align-middle">{paciente.nome}</td>
      <td className={`align-middle text-${corDaCondicao}`}>
        {paciente.condicao_atual || "Nenhuma consulta foi feita"}
      </td>
      <td className="align-middle">{paciente.cpf}</td>
      <td className="align-middle">{idadeDoPaciente}</td>
      <td className="text-center align-middle">
        <Button className="w-75" as="a" href={`paciente/${paciente.id}`}>
          <FaArrowRight />
        </Button>
      </td>
    </tr>
  );
}
