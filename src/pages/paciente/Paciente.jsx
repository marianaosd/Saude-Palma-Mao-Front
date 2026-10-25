import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import { formatarDataISO, formatarHorario, horarioParaMinutos, primeiroNome, rotuloData } from '../../services/agenda.js'
import './Paciente.css'

function formatarDataNascimento(valor) {
  const iso = String(valor || '').slice(0, 10)
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return 'Não informada'
  return `${dia}/${mes}/${ano}`
}

function formatarCpf(valor) {
  const digitos = String(valor || '').replace(/\D/g, '')
  if (digitos.length !== 11) return valor || 'Não informado'
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
}

function Paciente({ onTriagem, onBack, onClinicas, usuario }) {
  const [agendamentos, setAgendamentos] = useState([])
  const [historico, setHistorico] = useState([])
  const [erro, setErro] = useState('')
  const [dadosPaciente, setDadosPaciente] = useState(null)
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [erroDados, setErroDados] = useState('')
  const [avisoDados, setAvisoDados] = useState('')
  const [editandoDados, setEditandoDados] = useState(false)
  const [salvandoDados, setSalvandoDados] = useState(false)
  const [rascunhoDados, setRascunhoDados] = useState({ nome_completo: '', data_nascimento: '', telefone: '' })
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

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      try {
        const dados = await api('/pacientes/me')
        if (ativo) setDadosPaciente(dados)
      } catch (error) {
        if (ativo) setErroDados(error.message || 'Não foi possível carregar seus dados.')
      } finally {
        if (ativo) setCarregandoDados(false)
      }
    }

    carregarDados()
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
  const ultimaTriagem = historico[0]

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

  function handleCampoDados(event) {
    const { name, value } = event.currentTarget
    setRascunhoDados((atual) => ({ ...atual, [name]: value }))
  }

  async function handleSalvarDados(event) {
    event.preventDefault()
    setSalvandoDados(true)
    setErroDados('')
    setAvisoDados('')

    try {
      const atualizado = await api('/pacientes/me', {
        method: 'PUT',
        body: JSON.stringify({
          nome_completo: rascunhoDados.nome_completo.trim(),
          data_nascimento: rascunhoDados.data_nascimento,
          telefone: rascunhoDados.telefone.trim()
        })
      })
      setDadosPaciente(atualizado)
      setEditandoDados(false)
      setAvisoDados('Dados atualizados com sucesso.')
    } catch (error) {
      setErroDados(error.message || 'Não foi possível salvar seus dados.')
    } finally {
      setSalvandoDados(false)
    }
  }

  return (
    <section className="patient-page" aria-labelledby="patient-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-title">Olá, {primeiroNome(dadosPaciente?.nome_completo || usuario?.nome_completo)}! 👋</h1>

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

      <section className="patient-data-card" aria-labelledby="patient-data-title">
        <div className="patient-data-header">
          <div>
            <p className="eyebrow">Meus dados</p>
            <h2 id="patient-data-title">Seus dados cadastrais</h2>
          </div>

          {!carregandoDados && dadosPaciente && !editandoDados && (
            <button
              type="button"
              className="patient-data-button"
              onClick={() => {
                setRascunhoDados({
                  nome_completo: dadosPaciente.nome_completo || '',
                  data_nascimento: String(dadosPaciente.data_nascimento || '').slice(0, 10),
                  telefone: dadosPaciente.telefone || ''
                })
                setErroDados('')
                setAvisoDados('')
                setEditandoDados(true)
              }}
            >
              Editar meus dados
            </button>
          )}
        </div>

        {avisoDados && (
          <p className="patient-data-success" role="status">{avisoDados}</p>
        )}

        {erroDados && (
          <p className="patient-data-error" role="alert">{erroDados}</p>
        )}

        {carregandoDados && <p>Carregando seus dados…</p>}

        {!carregandoDados && dadosPaciente && !editandoDados && (
          <>
            <dl className="patient-data-list">
              <div className="patient-data-row">
                <dt>Nome completo</dt>
                <dd>{dadosPaciente.nome_completo || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>Data de nascimento</dt>
                <dd>{formatarDataNascimento(dadosPaciente.data_nascimento)}</dd>
              </div>
              <div className="patient-data-row">
                <dt>Telefone</dt>
                <dd>{dadosPaciente.telefone || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>E-mail</dt>
                <dd>{dadosPaciente.email || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>CPF</dt>
                <dd>{formatarCpf(dadosPaciente.cpf)}</dd>
              </div>
            </dl>
            <p className="patient-data-note">
              Para alterar e-mail ou CPF, procure a recepção da clínica.
            </p>
          </>
        )}

        {!carregandoDados && dadosPaciente && editandoDados && (
          <form className="patient-data-form" onSubmit={handleSalvarDados}>
            <label className="patient-data-field">
              Nome completo
              <input
                name="nome_completo"
                value={rascunhoDados.nome_completo}
                onChange={handleCampoDados}
                required
              />
            </label>

            <label className="patient-data-field">
              Data de nascimento
              <input
                name="data_nascimento"
                type="date"
                value={rascunhoDados.data_nascimento}
                onChange={handleCampoDados}
                required
              />
            </label>

            <label className="patient-data-field">
              Telefone
              <input
                name="telefone"
                type="tel"
                value={rascunhoDados.telefone}
                onChange={handleCampoDados}
              />
            </label>

            <div className="patient-data-actions">
              <button
                type="submit"
                className="patient-data-button patient-data-button--primary"
                disabled={salvandoDados}
              >
                {salvandoDados ? 'Salvando…' : 'Salvar alterações'}
              </button>
              <button
                type="button"
                className="patient-data-button"
                disabled={salvandoDados}
                onClick={() => {
                  setEditandoDados(false)
                  setErroDados('')
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  )
}

export default Paciente
