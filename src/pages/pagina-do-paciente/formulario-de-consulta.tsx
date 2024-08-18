import { FormEvent, useContext, useEffect, useState } from "react"
import { Button, Col, FloatingLabel, Form, Row, Stack } from "react-bootstrap"
import { calcularStatusDaCondicao, generateUUID, obterMensagemDeErro } from "../../lib/minhas-funcoes"
import { api } from "../../lib/axios.ts"
import { Consulta, ErrosDeRealizacaoDeConsulta, Mensagem, Paciente } from "../../lib/minhas-interfaces-e-tipos"
import { AppContext } from "../../context/AppContext.tsx"
import { AxiosError } from "axios"

interface FormularioDeConsultaProps {
  esconderFormularioDeConsulta: () => void
  pacienteId: string
  adicionarMensagem: (mensagem: Mensagem) => void
  setMensagens: (mensagens: Mensagem[]) => void
  mensagens: Mensagem[]
  formularioRef: React.MutableRefObject<null>
  rolarParaSessaoDoFormulario: () => void
  adicionarConsulta: (consulta: Consulta) => void
  setPaciente: (paciente: Paciente) => void
}

export function FormularioDeConsulta({
  esconderFormularioDeConsulta,
  adicionarMensagem,
  pacienteId,
  mensagens,
  setMensagens,
  formularioRef,
  rolarParaSessaoDoFormulario,
  adicionarConsulta,
  setPaciente,
}: FormularioDeConsultaProps) {
  const { mudarMensagemDeErroFatal } = useContext(AppContext)
  const [pressaoArterialDiastolica, setPressaoArterialDiastolica] = useState("")
  const [pressaoArterialSistolica, setPressaoArterialSistolica] = useState("")
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("")
  const [respiracao, setRespiracao] = useState("")
  const [temperatura, setTemperatura] = useState("")
  const [exibindoCheckBoxesDeSintomas, setExibindoCheckBoxesDeSintomas] = useState(false)
  const [boatoFinalizarAtivo, setBoatoFinalizarAtivo] = useState(true)

  const statusDaPressaoArterialDiastolica = calcularStatusDaCondicao("pressao arterial diastólica", Number(pressaoArterialDiastolica))
  const statusDaPressaoArterialSistolica = calcularStatusDaCondicao("pressao arterial sistólica", Number(pressaoArterialSistolica))
  const statusDaFrequenciaCardiaca = calcularStatusDaCondicao("frequência cardíaca",Number(frequenciaCardiaca))
  const statusDaRespiracao = calcularStatusDaCondicao("respiracao", Number(respiracao))
  const statusDaTemperatura = calcularStatusDaCondicao("temperatura", Number(temperatura))
  const camposDoFormularioValidos = validarCamposDoFormulário()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(rolarParaSessaoDoFormulario, [exibindoCheckBoxesDeSintomas])
  
  function validarCamposDoFormulário() {
    if(!validarCondicao(pressaoArterialSistolica)) {
      return false
    }
    if(!validarCondicao(pressaoArterialDiastolica)) {
      return false
    }
    if(!validarCondicao(temperatura)) {
      return false
    }
    if(!validarCondicao(frequenciaCardiaca)) {
      return false
    }
    if(!validarCondicao(respiracao)) {
      return false
    }

    return true
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    setBoatoFinalizarAtivo(false)

    event.preventDefault()

    const inputs = event.currentTarget.getElementsByTagName("input")
    const dados = new FormData()

    let sintomas = "{"
    
    for(const input of inputs) {
      sintomas += `"${input.name}":${input.checked},`
    }

    sintomas = sintomas.substring(0, sintomas.length -1)
    sintomas += '}'

    dados.append("sintomas", sintomas)
    dados.append("pressao_arterial_diastolica", String(Math.round(Number(pressaoArterialDiastolica!))))
    dados.append("pressao_arterial_sistolica", String(Math.round(Number(pressaoArterialSistolica!))))
    dados.append("frequencia_cardiaca", String(Math.round(Number(frequenciaCardiaca!))))
    dados.append("respiracao", String(Math.round(Number(respiracao!))))
    dados.append("temperatura", String(Number(temperatura!).toFixed(1)))

    api.post(`/consulta/${pacienteId}`, dados)
      .then(resposta => {
        const novaMensagem: Mensagem = [resposta.data.mensagem, "sucesso", generateUUID()]
        const novaConsulta: Consulta = resposta.data.consulta
        setPaciente(resposta.data.paciente as Paciente)
        adicionarConsulta(novaConsulta)
        adicionarMensagem(novaMensagem)
        esconderFormularioDeConsulta()
      }).catch(erro => {
        const axiosError = erro as AxiosError
        if(axiosError.code === "ERR_BAD_REQUEST" && axiosError.response?.status === 422) {

          const erros: ErrosDeRealizacaoDeConsulta = erro.response.data.errors
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
        } else {
          mudarMensagemDeErroFatal(obterMensagemDeErro(axiosError))
          setTimeout(() => {
            mudarMensagemDeErroFatal("")
          }, 3000)
        }

        esconderFormularioDeConsulta()
      })
  }

  function exibirCheckBoxesDeSintomas() {
    setExibindoCheckBoxesDeSintomas(true)
  }

  function esconderCheckBoxesDeSintomas() {
    setExibindoCheckBoxesDeSintomas(false)
  }
  
  function validarCondicao(valor: string){
    return !(valor === "")
  }

  function atualizarValorDaCondicao(valor: string, setCondicao: (novoValor: string) => void) {
    if(Number(valor) < 1) {
      setCondicao("")
    } else {
      setCondicao(valor)
    }
  }

  return (
    <section ref={formularioRef} className="p-3 bg-secondary-subtle mt-4">
      <Form 
        onSubmit={handleSubmit}
      >
        {!exibindoCheckBoxesDeSintomas ? (
          <>
            <Stack gap={3}>
              <Form.Group
                controlId="pressao_arterial_sistolica"
              >
                <FloatingLabel
                  label={(<>
                    Pressão Arterial Sistólica {statusDaPressaoArterialSistolica.length > 0 && (
                      <span className={`text-${statusDaPressaoArterialSistolica[1]}`}>
                        {`(${statusDaPressaoArterialSistolica[0]})`}
                      </span>
                    )}
                  </>)}
                >
                  <Form.Control
                    size="sm"
                    placeholder="Pressão Arterial Sistólica"
                    type="number"
                    min={1}
                    value={pressaoArterialSistolica}
                    onChange={event => atualizarValorDaCondicao(event.target.value, setPressaoArterialSistolica)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group
                controlId="pressao_arterial_diastolica"
              >
                <FloatingLabel
                  label={(<>
                    Pressão Arterial Diastólica {statusDaPressaoArterialDiastolica.length > 0 && (
                      <span className={`text-${statusDaPressaoArterialDiastolica[1]}`}>
                        {`(${statusDaPressaoArterialDiastolica[0]})`}
                      </span>
                    )}
                  </>)}
                >
                  <Form.Control
                    placeholder="Pressão Arterial Diastólica"
                    type="number"
                    min={1}
                    value={pressaoArterialDiastolica}
                    onChange={event => atualizarValorDaCondicao(event.target.value, setPressaoArterialDiastolica)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group
                controlId="frequencia_cardiaca"
              >
                <FloatingLabel
                  label={(<>
                    Frequência Cardíaca {statusDaFrequenciaCardiaca.length > 0 && (
                      <span className={`text-${statusDaFrequenciaCardiaca[1]}`}>
                        {`(${statusDaFrequenciaCardiaca[0]})`}
                      </span>
                    )}
                  </>)}
                >
                  <Form.Control
                    placeholder="Frequência cardíaca"
                    type="number"
                    min={1}
                    value={frequenciaCardiaca}
                    onChange={event => atualizarValorDaCondicao(event.target.value, setFrequenciaCardiaca)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group
                controlId="temperatura"
              >
                <FloatingLabel
                  label={(<>
                    Pressão Arterial Sistólica {statusDaTemperatura.length > 0 && (
                      <span className={`text-${statusDaTemperatura[1]}`}>
                        {`(${statusDaTemperatura[0]})`}
                      </span>
                    )}
                  </>)}
                >
                  <Form.Control
                    placeholder="Temperatura"
                    type="number"
                    min={1}
                    value={temperatura}
                    onChange={event => atualizarValorDaCondicao(event.target.value, setTemperatura)}
                  />
                </FloatingLabel>
              </Form.Group>
              <Form.Group
                controlId="respiracao"
              >
                <FloatingLabel 
                  label={(<>
                    Pressão Arterial Sistólica {statusDaRespiracao.length > 0 && (
                      <span className={`text-${statusDaRespiracao[1]}`}>
                        {`(${statusDaRespiracao[0]})`}
                      </span>
                    )}
                  </>)}
                >
                <Form.Control
                  placeholder="Respiração"
                  type="number"
                  min={1}
                  value={respiracao || ""}
                  onChange={event => atualizarValorDaCondicao(event.target.value, setRespiracao)}
                />
                </FloatingLabel>
              </Form.Group>
            </Stack>
          </>
        ): (
          <>
            <Row className="mb-4 justify-content-evenly">
              <Col>
                <Stack gap={1}>
                  <Form.Check
                    id="febre"
                    type="checkbox"
                    label="Febre"
                    name="febre"
                  />
                  <Form.Check
                    id="coriza"
                    type="checkbox"
                    label="Coriza"
                    name="coriza"
                  />
                  <Form.Check
                    id="nariz_entupido"
                    type="checkbox"
                    label="Nariz entupido"
                    name="nariz_entupido"
                  />
                  <Form.Check
                    id="cansaco"
                    type="checkbox"
                    label="Cansaço"
                    name="cansaco"
                  />
                  <Form.Check
                    id="tosse"
                    type="checkbox"
                    label="Tosse"
                    name="tosse"
                  />
                  <Form.Check
                    id="dor_de_cabeca"
                    type="checkbox"
                    label="Dor de cabeça"
                    name="dor_de_cabeca"
                  />
                  <Form.Check
                    id="dores_no_corpo"
                    type="checkbox"
                    label="Dores no corpo"
                    name="dores_no_corpo"
                  />
                </Stack>
              </Col>
              <Col>
                <Stack gap={1}>
                  <Form.Check
                    id="mal_estar_geral"
                    type="checkbox"
                    label="Mal estar geral"
                    name="mal_estar_geral"
                  />
                  <Form.Check
                    id="dor_de_garganta"
                    type="checkbox"
                    label="Dor de garganta"
                    name="dor_de_garganta"
                  />
                  <Form.Check
                    id="dificuldade_de_respirar"
                    type="checkbox"
                    label="Dificuldade de Respirar"
                    name="dificuldade_de_respirar"
                  />
                  <Form.Check
                    id="falta_de_paladar"
                    type="checkbox"
                    label="Falta de Paladar"
                    name="falta_de_paladar"
                  />
                  <Form.Check
                    id="falta_de_olfato"
                    type="checkbox"
                    label="Falta de Olfato"
                    name="falta_de_olfato"
                  />
                  <Form.Check
                    id="dificuldade_de_locomocao"
                    type="checkbox"
                    label="Dificuldade de locomoção"
                    name="dificuldade_de_locomocao"
                  />
                  <Form.Check
                    id="diarreia"
                    type="checkbox"
                    label="Diarreia"
                    name="diarreia"
                  />
                </Stack>
              </Col>
            </Row>
            <Button 
              disabled={!boatoFinalizarAtivo}
              type="submit" 
              className="me-3">
              {boatoFinalizarAtivo ? "Finalizar consulta" : "Finalizando consulta..."}
            </Button>
            <Button
              disabled={!boatoFinalizarAtivo}
              className="me-3" 
              variant="secondary"
              onClick={esconderCheckBoxesDeSintomas}
            >
              Voltar
            </Button>
            <Button
              disabled={!boatoFinalizarAtivo}
              variant="secondary" 
              onClick={esconderFormularioDeConsulta}
            >
              Cancelar
            </Button>
          </>
        )}
      </Form>
      {!exibindoCheckBoxesDeSintomas && (
        <div className="mt-4">
           <Button 
              disabled={!camposDoFormularioValidos} 
              className="me-3" 
              onClick={exibirCheckBoxesDeSintomas}
            >
              Continuar para sintomas
            </Button>
            <Button 
              variant="secondary" 
              onClick={esconderFormularioDeConsulta}
            >
              Cancelar
            </Button>
        </div>
      )}
    </section>
  )
}