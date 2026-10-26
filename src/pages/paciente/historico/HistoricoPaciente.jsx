import { useEffect, useState } from 'react'
import { api } from '../../../services/api.js'
import { formatarHorario, horarioParaMinutos, rotuloData } from '../../../services/agenda.js'
import '../pacienteHome/Paciente.css'

function formatarDataRegistro(valor) {
  const iso = String(valor || '').slice(0, 10)
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return 'data não informada'
  return `${dia}/${mes}/${ano}`
}

// A API devolve o status como texto livre ("Agendado", "Cancelado"...).
function classeDoStatus(status) {
  const chave = String(status || '').toLowerCase()

  if (chave.startsWith('cancel')) return ' appointment-status--cancelado'
  if (chave.startsWith('agend')) return ''
  return ' appointment-status--realizado'
}

// Aba Histórico: todas as consultas (inclusive as que já passaram e as
// canceladas) e as pré-triagens registradas, as mais recentes primeiro.
function HistoricoPaciente() {
  const [agendamentos, setAgendamentos] = useState([])
  const [triagens, setTriagens] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [listaAgendamentos, listaTriagens] = await Promise.all([
          api('/agendamentos'),
          api('/triagem/meu-historico')
        ])

        if (!ativo) return
        setAgendamentos(Array.isArray(listaAgendamentos) ? listaAgendamentos : [])
        setTriagens(Array.isArray(listaTriagens) ? listaTriagens : [])
      } catch (error) {
        if (ativo) setErro(error.message || 'Não foi possível carregar seu histórico.')
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  const consultas = [...agendamentos].sort((a, b) => {
    const dataA = String(a.data_consulta || '').slice(0, 10)
    const dataB = String(b.data_consulta || '').slice(0, 10)
    const comparacaoData = dataB.localeCompare(dataA)
    if (comparacaoData !== 0) return comparacaoData
    return horarioParaMinutos(b.horario_inicio || '00:00') -
      horarioParaMinutos(a.horario_inicio || '00:00')
  })

  return (
    <section className="patient-page" aria-labelledby="patient-history-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-history-title">Histórico</h1>

          <p>
            Suas consultas e as pré-triagens que você já registrou.
          </p>
        </div>
      </div>

      {erro && <p className="app-feedback error" role="alert">{erro}</p>}

      <section className="history-block" aria-labelledby="history-consultas-title">
        <h2 id="history-consultas-title" className="history-block__title">
          Minhas consultas
        </h2>

        {carregando ? (
          <p role="status" aria-live="polite">Carregando suas consultas…</p>
        ) : consultas.length > 0 ? (
          <ul className="history-list">
            {consultas.map((consulta) => (
              <li key={consulta.id} className="history-item">
                <h3 className="history-item__title">
                  {consulta.profissional || 'Profissional'}
                </h3>

                <p className="history-item__place">
                  {consulta.clinica || 'Clínica'}
                </p>

                <p className="history-item__date">
                  {rotuloData(String(consulta.data_consulta || '').slice(0, 10))} ·{' '}
                  {formatarHorario(consulta.horario_inicio)}
                </p>

                <span className={`appointment-status${classeDoStatus(consulta.status)}`}>
                  {consulta.status || 'Agendado'}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="info-card">
            <h3>Nenhuma consulta ainda</h3>
            <p>
              Quando você confirmar um atendimento, ele aparece aqui.
            </p>
          </div>
        )}
      </section>

      <section className="history-block" aria-labelledby="history-triagens-title">
        <h2 id="history-triagens-title" className="history-block__title">
          Minhas pré-triagens
        </h2>

        {carregando ? (
          <p role="status" aria-live="polite">Carregando suas pré-triagens…</p>
        ) : triagens.length > 0 ? (
          <ul className="history-list">
            {triagens.map((triagem) => (
              <li key={triagem.id} className="history-item">
                <h3 className="history-item__title">
                  {triagem.nome_categoria || 'Pré-triagem'}
                </h3>

                <p className="history-item__place">
                  {String(triagem.status_final || '').replaceAll('_', ' ')}
                </p>

                <p className="history-item__date">
                  Registrada em {formatarDataRegistro(triagem.data_registro)}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="info-card">
            <h3>Ainda sem pré-triagem</h3>
            <p>
              A pré-triagem fica salva aqui para você acompanhar depois.
            </p>
          </div>
        )}
      </section>
    </section>
  )
}

export default HistoricoPaciente
