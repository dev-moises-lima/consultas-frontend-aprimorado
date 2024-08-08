import moment from "moment";
import { calcularStatusDaCondicao, obterCorDaCondicao } from "../../lib/minhas-funcoes";
import { Consulta } from "../../lib/minhas-interfaces-e-tipos";

interface ItemDaTabelaConsultasProps {
  consulta: Consulta
}

export function ItemDaTabelaConsultas({
  consulta
} : ItemDaTabelaConsultasProps) {

  const corDaCondicao = obterCorDaCondicao(consulta.condicao)
  const statusDaPressaoArterialDiastolica = calcularStatusDaCondicao("pressao arterial diastólica", consulta.pressao_arterial_diastolica)
  const statusDaPressaoArterialSistolica = calcularStatusDaCondicao("pressao arterial sistólica", consulta.pressao_arterial_sistolica)
  const statusDaFrequenciaCardiaca = calcularStatusDaCondicao("frequência cardíaca", consulta.frequencia_cardiaca)
  const statusDaRespiracao = calcularStatusDaCondicao("respiracao", consulta.respiracao)
  const statusDaTemperatura = calcularStatusDaCondicao("temperatura", consulta.temperatura)

  return (
    <tr>
      <td className={`text-${corDaCondicao}`}>{consulta.condicao}</td>
      <td className={`text-${statusDaPressaoArterialSistolica[1]}`}>{statusDaPressaoArterialSistolica[0]}</td>
      <td className={`text-${statusDaPressaoArterialDiastolica[1]}`}>{statusDaPressaoArterialDiastolica[0]}</td>
      <td className={`text-${statusDaFrequenciaCardiaca[1]}`}>{statusDaFrequenciaCardiaca[0]}</td>
      <td className={`text-${statusDaRespiracao[1]}`}>{statusDaRespiracao[0]}</td>
      <td className={`text-${statusDaTemperatura[1]}`}>{statusDaTemperatura[0]}</td>
      <td>{moment(consulta.created_at).format("DD/MM/YYYY")}</td>
    </tr>
  )
}