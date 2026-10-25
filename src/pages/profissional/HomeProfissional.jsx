import { useEffect, useMemo, useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import AppointmentCard from '../../components/profissional/AppointmentCard.jsx'
import ProfessionalHomePanel from '../../components/profissional/ProfessionalHomePanel.jsx'
import { api } from '../../services/api.js'
import './HomeProfissional.css'

// ─── helpers ─────────────────────────────────────────────────────────────────

// Calcula as iniciais de um nome completo (até 2 letras).
function calcularIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

// Fatia 'HH:MM:SS' para 'HH:MM'; já aceita 'HH:MM'.
function formatarHorario(h) {
  return String(h || '').slice(0, 5)
}

// Retorna a data local de hoje como 'YYYY-MM-DD'.
function dataHojeStr() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const dd   = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Converte 'YYYY-MM-DD' em Date local sem deslocamento de fuso.
function parseDateLocal(str) {
  const [y, m, d] = String(str).slice(0, 10).split('-').map(Number)
  return new Date(y, m - 1, d)
}

const DIAS_SEMANA = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]
const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

// Formata 'YYYY-MM-DD' como 'Dia da semana, D de mês'.
function dataExtenso(str) {
  const d = parseDateLocal(str)
  return `${DIAS_SEMANA[d.getDay()]}, ${d.getDate()} de ${MESES[d.getMonth()]}`
}

// Rótulo curto para uso em detail: 'Hoje', 'Amanhã' ou 'DD/MM'.
function rotuloData(dataConsulta, hoje) {
  if (dataConsulta === hoje) return 'Hoje'
  const d = new Date()
  d.setDate(d.getDate() + 1)
  const amanhaISO =
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  if (dataConsulta === amanhaISO) return 'Amanhã'
  const [, m, dia] = dataConsulta.split('-')
  return `${dia}/${m}`
}

// Monta a linha de credenciais do profissional (conselho + registro + UF).
function montarCredenciais(perfil) {
  if (!perfil.registro_conselho) return ''
  const uf = perfil.uf_conselho ? `/${perfil.uf_conselho}` : ''
  return `${perfil.conselho || ''} ${perfil.registro_conselho}${uf}`.trim()
}

// ─── ações rápidas (configuração estática de UI) ──────────────────────────────

const quickActions = [
  { id: 'agenda',   icon: 'calendarAction', label: 'Ver agenda' },
  { id: 'horarios', icon: 'settings',       label: 'Configurar horários' },
  { id: 'historico',icon: 'historyAction',  label: 'Histórico' },
]

function getInitialPanel() {
  const panelType = window.location.hash.match(/^#profissional\/(perfil)$/)?.[1]
  return panelType ? { type: panelType } : null
}

// ─── componente principal ─────────────────────────────────────────────────────

// onLogout vem do App.jsx e é usado pelo botão "Sair" do cabeçalho do layout.
function HomeProfissional({ onLogout }) {
  const [perfil, setPerfil]           = useState(null)
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando]   = useState(true)
  const [erro, setErro]               = useState('')
  const [available, setAvailable]     = useState(true)
  const [panel, setPanel]             = useState(getInitialPanel)

  // Carrega perfil e agendamentos uma única vez ao montar.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const [dadosPerfil, dadosAgenda] = await Promise.all([
          api('/profissionais/me'),
          api('/profissionais/me/agendamentos'),
        ])
        if (cancelado) return
        setPerfil(dadosPerfil)
        setAgendamentos(Array.isArray(dadosAgenda) ? dadosAgenda : [])
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Não foi possível carregar os dados.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => { cancelado = true }
  }, [])

  // ─── derivações ────────────────────────────────────────────────────────────

  const hoje = useMemo(() => dataHojeStr(), [])

  // Próximas consultas: status 'Agendado' e data >= hoje, ordenadas por data e horário.
  const proximos = useMemo(() => {
    return agendamentos
      .filter((a) => a.status === 'Agendado' && a.data_consulta >= hoje)
      .sort((a, b) => {
        const porData = a.data_consulta.localeCompare(b.data_consulta)
        return porData !== 0 ? porData : a.horario_inicio.localeCompare(b.horario_inicio)
      })
  }, [agendamentos, hoje])

  // Total de consultas agendadas para hoje.
  const totalHoje = useMemo(
    () => agendamentos.filter((a) => a.status === 'Agendado' && a.data_consulta === hoje).length,
    [agendamentos, hoje]
  )

  const proximo = proximos[0] ?? null

  // Lista para AppointmentCard (até 3): mapeia campos da API para o shape do componente.
  const proximosCard = useMemo(() => {
    return proximos.slice(0, 3).map((a) => ({
      id:       a.id,
      time:     formatarHorario(a.horario_inicio),
      name:     a.paciente,
      initials: calcularIniciais(a.paciente),
      detail:   `${rotuloData(a.data_consulta, hoje)} · ${a.clinica}`,
      id_triagem: a.id_triagem,
      // symptoms e priority não existem na API — omitidos intencionalmente
    }))
  }, [proximos, hoje])

  // Lista completa para o painel (sem slice).
  const proximosPanel = useMemo(() => {
    return proximos.map((a) => ({
      id:       a.id,
      time:     formatarHorario(a.horario_inicio),
      name:     a.paciente,
      initials: calcularIniciais(a.paciente),
      detail:   `${rotuloData(a.data_consulta, hoje)} · ${a.clinica}`,
      id_triagem: a.id_triagem,
    }))
  }, [proximos, hoje])

  // Dados do perfil para o painel e cabeçalho.
  const nomePerfil   = perfil?.nome || 'Profissional'
  const iniciaisPerfil = calcularIniciais(nomePerfil)
  const credenciais  = perfil ? montarCredenciais(perfil) : ''
  const professionalParaPainel = {
    name:         nomePerfil,
    initials:     iniciaisPerfil,
    specialty:    '',   // especialidade real requer endpoint adicional
    registration: credenciais,
    email:        perfil?.email || '',
  }

  // ─── textos derivados ───────────────────────────────────────────────────────

  const tituloResumo = totalHoje === 0
    ? 'Nenhuma consulta hoje'
    : totalHoje === 1
      ? '1 consulta agendada'
      : `${totalHoje} consultas agendadas`

  function textoProxima() {
    if (!proximo) return 'Sem próximas consultas'
    const hora = formatarHorario(proximo.horario_inicio)
    if (proximo.data_consulta === hoje) return `Próxima às ${hora}`
    const [, m, d] = proximo.data_consulta.split('-')
    return `Próxima em ${d}/${m} às ${hora}`
  }

  const subtituloConsultas = proximo ? dataExtenso(proximo.data_consulta) : 'Sem consultas futuras'

  // ─── navegação e painéis ────────────────────────────────────────────────────

  function navigate(destination) {
    if (destination === 'inicio') {
      if (window.location.hash !== '#profissional') window.location.hash = '#profissional'
      document.getElementById('professional-content')?.focus({ preventScroll: true })
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }
    if (destination === 'agenda') {
      window.location.hash = '#agenda-profissional'
      return
    }
    if (destination === 'historico' || destination === 'perfil') {
      window.location.hash = destination === 'historico' ? '#historico-profissional' : '#perfil-profissional'
      return
    }
    setPanel({ type: destination })
  }

  function closePanel() {
    setPanel(null)
    if (window.location.hash === '#profissional/perfil') {
      window.location.hash = '#profissional'
    }
  }

  function viewTriage(appointment) {
    setPanel({ type: 'triagem', appointment })
  }

  // ─── render ─────────────────────────────────────────────────────────────────

  return (
    <ProfessionalLayout
      activePage={panel?.type === 'perfil' ? panel.type : 'inicio'}
      onNavigate={navigate}
      onLogout={onLogout}
    >
      {/* Cabeçalho: usa dados reais do perfil quando disponíveis */}
      <header className="professional-header">
        <div className="professional-header__identity">
          <div className="professional-header__person">
            <div className="professional-header__avatar" aria-hidden="true">
              {iniciaisPerfil}
            </div>
            <div className="professional-header__introduction">
              <p className="professional-header__greeting">Olá,</p>
              <h1>{nomePerfil}</h1>
              {credenciais && (
                <p className="professional-header__credentials">{credenciais}</p>
              )}
            </div>
          </div>
          <button
            className="professional-header__notifications"
            type="button"
            aria-label="Notificações"
            onClick={() => navigate('notificacoes')}
          >
            <ProfessionalIcon name="bell" />
          </button>
        </div>

        {/* Switch de disponibilidade: continua local */}
        <button
          className="professional-availability"
          type="button"
          role="switch"
          aria-checked={available}
          aria-label="Disponibilidade para atendimento"
          onClick={() => setAvailable(!available)}
        >
          <span>Status de disponibilidade</span>
          <span className={`professional-availability__status${available ? '' : ' professional-availability__status--inactive'}`}>
            {available ? 'Ativo' : 'Inativo'}
          </span>
        </button>
      </header>

      <div className="professional-home">

        {/* Estado de carregamento ou erro na área principal */}
        {carregando && (
          <p className="professional-home__empty" role="status" aria-live="polite">
            Carregando suas consultas…
          </p>
        )}

        {!carregando && erro && (
          <p className="professional-home__empty" role="alert">
            {erro}
          </p>
        )}

        {!carregando && !erro && (
          <>
            {/* Cartão de resumo do dia */}
            <button
              className="professional-summary"
              type="button"
              onClick={() => navigate('agenda')}
            >
              <span className="professional-summary__icon">
                <ProfessionalIcon name="calendarSummary" />
              </span>
              <span className="professional-summary__content">
                <span className="professional-summary__eyebrow">Resumo de hoje</span>
                <span className="professional-summary__title">{tituloResumo}</span>
                <span className="professional-summary__next">{textoProxima()}</span>
              </span>
              <ProfessionalIcon name="chevronRight" />
            </button>

            {/* Acesso rápido */}
            <div className="professional-quick-actions" role="group" aria-label="Acesso rápido">
              {quickActions.map(({ id, icon, label }) => (
                <button
                  key={id}
                  className="professional-quick-action"
                  type="button"
                  onClick={() => navigate(id)}
                >
                  <span className="professional-quick-action__icon">
                    <ProfessionalIcon name={icon} />
                  </span>
                  <span className="professional-quick-action__label">{label}</span>
                </button>
              ))}
            </div>

            {/* Próximas consultas */}
            <section className="professional-appointments" aria-labelledby="upcoming-title">
              <div className="professional-appointments__heading">
                <div>
                  <h2 id="upcoming-title">Próximas consultas</h2>
                  <p>{subtituloConsultas}</p>
                </div>
                <button
                  className="professional-view-all"
                  type="button"
                  onClick={() => navigate('agenda')}
                >
                  Ver todas
                </button>
              </div>

              {proximosCard.length === 0 ? (
                <p className="professional-home__empty">
                  Nenhuma consulta futura agendada.
                </p>
              ) : (
                <div className="professional-appointments__list">
                  {proximosCard.map((appointment, index) => (
                    <AppointmentCard
                      key={appointment.id}
                      appointment={appointment}
                      highlighted={index === 0}
                      onViewTriage={viewTriage}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {panel && (
        <ProfessionalHomePanel
          key={panel.type}
          panel={panel}
          professional={professionalParaPainel}
          appointments={proximosPanel}
          historyRecords={[]}
          onClose={closePanel}
        />
      )}
    </ProfessionalLayout>
  )
}

export default HomeProfissional
