export interface Paciente {
  id: number
  nome: string
  cpf: string
  telefone: string
  data_de_nascimento: string
  condicao_atual: CondicaoDoPaciente
  foto: string
}

export interface Consulta {
  id: number
  created_at: string
  condicao: CondicaoDoPaciente
  frequencia_cardiaca: number
  pressao_arterial_sistolica: number
  respiracao: number
  temperatura: number
  porcentagem_dos_sintomas_sentidos: number
  pressao_arterial_diastolica: number
}

export interface ErrosDeCadastroDePaciente {
  nome? : string[]
  cpf? : string[]
  telefone? : string[]
  foto?: string[]
  data_de_nascimento?: string[]
}

export interface ErrosDeRealizacaoDeConsulta {
  sintomas?: string[]
  pressao_arterial_diastolica?: string[]
  pressao_arterial_sistolica?: string[]
  frequencia_cardiaca?: string[]
  respiracao?: string[]
  temperatura?: string[]
}

export type Mensagem = [string, "erro" | "sucesso", string]

export type CondicaoDoPaciente = "Sintomas insuficientes" | "Potencial infectado" | "Possível infectado" | null

export interface Sintomas {
  febre: boolean
}
