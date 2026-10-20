
import { useEffect, useState } from 'react'
import { api } from '../../../services/api.js'

function formatarData(data) {
  if (!data) return 'Não informada'

  const valor = String(data).slice(0, 10)
  const partes = valor.split('-')

  if (partes.length !== 3) return valor

  return `${partes[2]}/${partes[1]}/${partes[0]}`
}

function formatarResposta(resposta) {
  if (resposta.resposta_bool !== null && resposta.resposta_bool !== undefined) {
    return resposta.resposta_bool ? 'Sim' : 'Não'
  }

  if (resposta.resposta_texto !== null && resposta.resposta_texto !== undefined) {
    return String(resposta.resposta_texto)
  }

  return 'Sem resposta'
}

function TriagePanel({ appointment }) {
  const [triagem, setTriagem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (!appointment?.id) return

    let cancelado = false

    async function carregarTriagem() {
      setCarregando(true)
      setTriagem(null)
      setErro('')

      try {
        const dados = await api(
          `/profissionais/me/agendamentos/${appointment.id}/triagem`
        )

        if (!cancelado) setTriagem(dados)
      } catch (error) {
        if (!cancelado) {
          setErro(error.message || 'Não foi possível carregar a pré-triagem.')
        }
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregarTriagem()

    return () => {
      cancelado = true
    }
  }, [appointment?.id])

  const semConsulta = !appointment?.id
  const exibirCarregando = carregando && !semConsulta
  const mensagemErro = semConsulta ? 'Não foi possível identificar esta consulta.' : erro

  return (
    <div className="professional-panel__triage">
      <p>
        {appointment.time} · {appointment.name}
      </p>

      <h3>Informações da pré-triagem</h3>

      {exibirCarregando && (
        <p role="status" aria-live="polite">
          Carregando informações da pré-triagem...
        </p>
      )}

      {!exibirCarregando && mensagemErro && (
        <p className="professional-panel__triage-pending" role="alert">
          {mensagemErro}
        </p>
      )}

      {!exibirCarregando && !mensagemErro && triagem && (
        <>
          <p>
            <strong>Categoria:</strong>{' '}
            {triagem.nome_categoria || 'Não informada'}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {triagem.status_final || 'Não informado'}
          </p>

          <p>
            <strong>Data do registro:</strong>{' '}
            {formatarData(triagem.data_registro)}
          </p>

          <h3>Respostas do questionário</h3>

          {Array.isArray(triagem.respostas) && triagem.respostas.length > 0 ? (
            <ul>
              {triagem.respostas.map((resposta, index) => (
                <li key={`${resposta.texto_pergunta}-${index}`}>
                  <strong>{resposta.texto_pergunta}</strong>
                  <p>{formatarResposta(resposta)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>Não há respostas registradas para esta pré-triagem.</p>
          )}

          <p className="professional-panel__triage-pending">
            As informações apresentadas são relatos da pré-triagem e não
            representam um diagnóstico médico.
          </p>
        </>
      )}
    </div>
  )
}

export default TriagePanel
