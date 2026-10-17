import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { formatarHorario, primeiroNome, rotuloData } from '../../services/agenda.js'
import './Paciente.css'

function Paciente({ onTriagem, onBack, onClinicas, usuario }) {
  const [agendamentos, setAgendamentos] = useState([])
  const [historico, setHistorico] = useState([])
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [listaAgendamentos, listaHistorico] = await Promise.all([
          api('/agendamentos'),
          api('/triagem/meu-historico')
        ])

        if (!ativo) return
        setAgendamentos(listaAgendamentos)
        setHistorico(listaHistorico)
      } catch (error) {
        if (ativo) setErro(error.message)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  const hoje = new Date().toLocaleDateString('en-CA')
  const proximo = agendamentos.find(
    (item) => item.status === 'Agendado' && item.data_consulta >= hoje
  )
  const ultimaTriagem = historico[0]

  return (
    <section className="patient-page" aria-labelledby="patient-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-title">Olá, {primeiroNome(usuario?.nome_completo)}! 👋</h1>

          <p>
            Como podemos ajudar você hoje?
          </p>
        </div>

        <button
          type="button"
          className="back-home-button patient-back-button"
          onClick={onBack}
        >
          ← Sair
        </button>
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

      <section className="patient-info-grid">
        <article className="info-card">
          <p className="eyebrow">Próxima consulta</p>

          {proximo ? (
            <>
              <h2>{proximo.profissional}</h2>
              <p>{proximo.clinica}</p>
              <span className="appointment-status">
                {rotuloData(proximo.data_consulta)} · {formatarHorario(proximo.horario_inicio)} · {proximo.status}
              </span>
            </>
          ) : (
            <>
              <h2>Nenhuma consulta agendada</h2>
              <p>
                Quando você confirmar um atendimento, ele aparece aqui.
              </p>
            </>
          )}
        </article>

        <article className="info-card">
          <p className="eyebrow">Última pré-triagem</p>

          {ultimaTriagem ? (
            <>
              <h2>{ultimaTriagem.nome_categoria}</h2>
              <p>{ultimaTriagem.status_final.replaceAll('_', ' ')}</p>
              <span className="appointment-status">
                Registrada
              </span>
            </>
          ) : (
            <>
              <h2>Ainda sem histórico</h2>
              <p>
                A pré-triagem fica salva para você acompanhar depois.
              </p>
            </>
          )}
        </article>
      </section>
    </section>
  )
}

export default Paciente
