import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { formatarDataISO, formatarHorario, horarioParaMinutos, primeiroNome, rotuloData } from '../../services/agenda.js'
import './Paciente.css'

// Início da área do paciente. As outras abas ficam em HistoricoPaciente.jsx e
// PerfilPaciente.jsx; a casca (cabeçalho, abas e Sair) é o PatientLayout,
// aplicado no App.jsx.
function Paciente({ onTriagem, onClinicas, usuario }) {
  const [agendamentos, setAgendamentos] = useState([])
  const [nomePaciente, setNomePaciente] = useState(usuario?.nome_completo || '')
  const [erro, setErro] = useState('')
  const [confirmandoCancelamentoId, setConfirmandoCancelamentoId] = useState(null)
  const [cancelandoId, setCancelandoId] = useState(null)
  const [erroCancelamentoId, setErroCancelamentoId] = useState(null)
  const [erroCancelamento, setErroCancelamento] = useState('')
  const [avisoCancelamento, setAvisoCancelamento] = useState('')

  async function recarregarAgendamentos() {
    const listaAgendamentos = await api('/agendamentos')
    setAgendamentos(Array.isArray(listaAgendamentos) ? listaAgendamentos : [])
  }

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const listaAgendamentos = await api('/agendamentos')
        if (!ativo) return
        setAgendamentos(listaAgendamentos)
      } catch (error) {
        if (ativo) setErro(error.message)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  // O nome vem de /pacientes/me para refletir uma edição feita na aba Perfil.
  // Se a chamada falhar, o nome da sessão continua valendo.
  useEffect(() => {
    let ativo = true

    api('/pacientes/me')
      .then((dados) => {
        if (ativo) setNomePaciente(dados.nome_completo || '')
      })
      .catch(() => {})

    return () => { ativo = false }
  }, [])

  const hoje = formatarDataISO(new Date())
  const consultasAgendadas = agendamentos
    .filter((item) => (
      item.status === 'Agendado' && String(item.data_consulta || '').slice(0, 10) >= hoje
    ))
    .sort((a, b) => {
      const dataA = String(a.data_consulta || '').slice(0, 10)
      const dataB = String(b.data_consulta || '').slice(0, 10)
      const comparacaoData = dataA.localeCompare(dataB)
      if (comparacaoData !== 0) return comparacaoData
      return horarioParaMinutos(a.horario_inicio || '00:00') -
        horarioParaMinutos(b.horario_inicio || '00:00')
    })

  async function handleConfirmarCancelamento(id) {
    try {
      setCancelandoId(id)
      setErroCancelamentoId(null)
      setErroCancelamento('')
      setAvisoCancelamento('')
      await api(`/agendamentos/${id}/cancelar`, { method: 'PATCH' })
      setConfirmandoCancelamentoId(null)
      setAvisoCancelamento('Consulta cancelada com sucesso.')

      try {
        await recarregarAgendamentos()
      } catch (error) {
        setErro(error.message || 'Erro ao atualizar as consultas.')
      }
    } catch (error) {
      setErroCancelamentoId(id)
      setErroCancelamento(error.message || 'Erro ao cancelar consulta.')
    } finally {
      setCancelandoId(null)
    }
  }

  return (
    <section className="patient-page" aria-labelledby="patient-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-title">Olá, {primeiroNome(nomePaciente)}! 👋</h1>

          <p>
            Como podemos ajudar você hoje?
          </p>
        </div>
      </div>

      {erro && <p className="app-feedback error" role="alert">{erro}</p>}

      <section className="triage-card" aria-labelledby="triage-title">
        <div>
          <span className="card-label">Próximo passo</span>

          <h2 id="triage-title">
            Precisa de atendimento?
          </h2>

          <p>
            Responda algumas perguntas sobre como você está se sentindo.
            A pré-triagem ajuda a orientar o próximo passo.
          </p>
        </div>

        <button
          type="button"
          className="primary-button triage-button"
          onClick={onTriagem}
        >
          Iniciar pré-triagem
        </button>
      </section>

      <section
        className="quick-actions"
        aria-labelledby="quick-actions-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Acesso rápido</p>

          <h2 id="quick-actions-title">
            O que você precisa?
          </h2>
        </div>

        <div className="quick-actions-grid">
          <button type="button" className="quick-action" onClick={onClinicas}>
            <strong>Clínicas próximas</strong>
            <span>Encontre locais de atendimento.</span>
          </button>

          <button type="button" className="quick-action" onClick={onTriagem}>
            <strong>Nova pré-triagem</strong>
            <span>Registre como você está se sentindo.</span>
          </button>

          <button type="button" className="quick-action" onClick={onClinicas}>
            <strong>Agendar consulta</strong>
            <span>Escolha clínica, profissional e horário.</span>
          </button>
        </div>
      </section>

      <article className="info-card patient-appointments-card">
        <p className="eyebrow">Minhas consultas agendadas</p>

        {avisoCancelamento && (
          <p className="patient-cancel-success" role="status">
            {avisoCancelamento}
          </p>
        )}

        {consultasAgendadas.length > 0 ? (
          <ul className="patient-appointments-list">
            {consultasAgendadas.map((consulta) => {
              const estaConfirmando = confirmandoCancelamentoId === consulta.id
              const estaCancelando = cancelandoId === consulta.id

              return (
                <li key={consulta.id} className="patient-appointment-item">
                  <h2 className="patient-appointment-name">
                    {consulta.profissional || 'Profissional'}
                  </h2>
                  <p className="patient-appointment-clinic">
                    {consulta.clinica || 'Clínica'}
                  </p>
                  <span className="appointment-status">
                    {rotuloData(String(consulta.data_consulta).slice(0, 10))} · {formatarHorario(consulta.horario_inicio)} · {consulta.status}
                  </span>

                  {estaConfirmando ? (
                    <div className="patient-cancel-confirm" role="group" aria-label="Confirmar cancelamento">
                      <p>
                        Cancelar esta consulta? Se precisar, você poderá agendar outra depois.
                      </p>
                      <div className="patient-cancel-actions">
                        <button
                          type="button"
                          className="patient-cancel-button patient-cancel-button--confirm"
                          disabled={estaCancelando}
                          onClick={() => handleConfirmarCancelamento(consulta.id)}
                        >
                          {estaCancelando ? 'Cancelando...' : 'Sim, cancelar'}
                        </button>
                        <button
                          type="button"
                          className="patient-cancel-button patient-cancel-button--back"
                          disabled={cancelandoId !== null}
                          onClick={() => {
                            setConfirmandoCancelamentoId(null)
                            setErroCancelamentoId(null)
                            setErroCancelamento('')
                          }}
                        >
                          Voltar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="patient-cancel-button patient-cancel-button--request"
                      disabled={cancelandoId !== null}
                      onClick={() => {
                        setConfirmandoCancelamentoId(consulta.id)
                        setErroCancelamentoId(null)
                        setErroCancelamento('')
                        setAvisoCancelamento('')
                      }}
                    >
                      Cancelar consulta
                    </button>
                  )}

                  {erroCancelamentoId === consulta.id && erroCancelamento && (
                    <p className="patient-cancel-error" role="alert">
                      {erroCancelamento}
                    </p>
                  )}
                </li>
              )
            })}
          </ul>
        ) : (
          <>
            <h2>Nenhuma consulta agendada</h2>
            <p>
              Quando você confirmar um atendimento, ele aparece aqui.
            </p>
          </>
        )}
      </article>
    </section>
  )
}

export default Paciente
