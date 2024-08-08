import moment from "moment"
import { CondicaoDoPaciente } from "./minhas-interfaces-e-tipos";

export function inverterData(data: string, separador: string) {
  return data.split(separador).reverse().join(separador)
}

export function obterCorDaCondicao (condicao: CondicaoDoPaciente) {
  switch (condicao) {
    case null:
      return "secondary"
    case "Sintomas insuficientes":
      return "success"
    case "Potencial infectado":
      return "warning"
    case "Possível infectado":
      return "danger"
  }
}

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16);
  })
}

export function normalizar(texto: string) {
  return texto
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
  .replace(/ç/g, "c")              // Remove cedilhas
  .replace(/\s/g, "")             
}

type condicao = "pressao arterial diastólica" | "pressao arterial sistólica" | "frequência cardíaca" | "respiracao" | "temperatura"

export function calcularStatusDaCondicao(condicaoAVerificar: condicao, valorDaCondicao: number | undefined) {
  if(!valorDaCondicao) {
    return []
  }
  
  switch (condicaoAVerificar) {
    case "pressao arterial sistólica":
      if(valorDaCondicao < 60) {
        return ["Hipotenso", "warning"]
      }
      if(valorDaCondicao <= 85) {
        return ["Normotenso", "success"]
      }
      if(valorDaCondicao <= 89) {
        return ["Normotenso Limitrofe", "info"]
      }
      if(valorDaCondicao <= 99) {
        return ["Hipertenso Leve", "warning"]
      }
      if(valorDaCondicao <= 109) {
        return ["Hipertenso Moderado", "danger"]
      }
      if(valorDaCondicao >= 110) {
        return ["Hipertenso Grave", "danger"]
      }
      break
    case "pressao arterial diastólica":
      if(valorDaCondicao < 90) {
        return ["Hipotenso", "warning"]
      }
      if(valorDaCondicao <= 130) {
        return ["Normotenso", "success"]
      }
      if(valorDaCondicao <= 139) {
        return ["Normotenso Limitrofe", "info"]
      }
      if(valorDaCondicao <= 159) {
        return ["Hipertenso Leve", "warning"]
      }
      if(valorDaCondicao <= 179) {
        return ["Hipertenso Moderado", "danger"]
      }
      if(valorDaCondicao >= 180) {
        return ["Hipertenso Grave", "danger"]
      }
      break
    case "frequência cardíaca":
      if(valorDaCondicao < 60) {
        return ["Brandicárdico", "warning"]
      }
      if(valorDaCondicao <= 100) {
        return ["Normocárdico", "success"]
      }
      if(valorDaCondicao > 100) {
        return ["Taquicárdico", "danger"]
      }
      break
    case "respiracao":
      if(valorDaCondicao < 14) {
        return ["Brandipnéico", "warning"]
      }
      if(valorDaCondicao <= 20) {
        return ["Eupnéico", "success"]
      }
      if(valorDaCondicao > 20) {
        return ["Taquipnéico", "danger"]
      }
      break
    case "temperatura":
      if(valorDaCondicao < 35) {
        return ["Hipotermia", "warning"]
      }
      if(valorDaCondicao < 36.1) {
        return ["Baixa Normal", "info"]
      }
      if(valorDaCondicao <= 37.2) {
        return ["Afebril", "success"]
      }
      if(valorDaCondicao <= 37.7) {
        return ["Feblil", "warning"]
      }
      if(valorDaCondicao <= 38.9) {
        return ["Febre", "danger"]
      }
      if(valorDaCondicao <= 40) {
        return ["Pirexia", "danger"]
      }
      if(valorDaCondicao > 40) {
        return ["Hiperpirexia", "danger"]
      }
      break
  }

  return ["Classificação nâo identificada", "secondary"]
}

export function validarDataDeNascimento(data: string) {
  if(data.length < 10) return false

  const novaData = moment(data, "YYYY-MM-DD")

  return novaData.isValid() && novaData.isBefore(moment(), "day")
}
