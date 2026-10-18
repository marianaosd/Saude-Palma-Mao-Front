import { useEffect, useMemo, useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import AgendaAppointmentRow from '../../components/profissional/agendaProfissional/AgendaAppointmentRow.jsx'
import AgendaAvailableSlot from '../../components/profissional/agendaProfissional/AgendaAvailableSlot.jsx'
import AgendaDaySelector from '../../components/profissional/agendaProfissional/AgendaDaySelector.jsx'
import ProfessionalHomePanel from '../../components/profissional/ProfessionalHomePanel.jsx'
import { api } from '../../services/api.js'
import './AgendaProfissional.css'

// ─── helpers de data ─────────────────────────────────────────────────────────

const DIAS_SEMANA_ABREV = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']
const DIAS_SEMANA_NOME  = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado',
]
const MESES_NOME = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

// Converte 'YYYY-MM-DD' em Date local, sem deslocamento de fuso horário.
function parseDateLocal(dateStr) {
  const [year, month, day] = String(dateStr).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Calcula as iniciais de um nome completo (até 2 letras).
function calcularIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

// Fatia 'HH:MM:SS' para 'HH:MM'; já aceita 'HH:MM'.
function formatarHorario(horario) {
  return String(horario || '').slice(0, 5)
}

// Formata uma Date como 'YYYY-MM-DD' (data local, sem UTC).
function formatarDataLocal(data) {
  const yyyy = data.getFullYear()
  const mm   = String(data.getMonth() + 1).padStart(2, '0')
  const dd   = String(data.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

// Retorna a data de hoje como 'YYYY-MM-DD'.
function dataHojeStr() {
  return formatarDataLocal(new Date())
}

// Monta os cinco dias úteis (seg–sex) da semana que contém refDate.
function diasDaSemana(refDate) {
  const dow = refDate.getDay()
  const diffParaSeg = dow === 0 ? -6 : 1 - dow
  const segunda = new Date(refDate)
  segunda.setDate(refDate.getDate() + diffParaSeg)

  return Array.from({ length: 5 }, (_, i) => {
    const data = new Date(segunda)
    data.setDate(segunda.getDate() + i)
    return {
      id:           formatarDataLocal(data),
      weekday:      DIAS_SEMANA_ABREV[data.getDay()],
      weekdayName:  DIAS_SEMANA_NOME[data.getDay()],
      date:         data.getDate(),
      appointments: [],
      availableSlots: [],
    }
  })
}

// Recebe a lista bruta da API e a data de referência da semana a exibir.
// Devolve os cinco dias com as consultas do período, ordenadas por horário.
function transformarAgendamentos(lista, refDate) {
  const dias = diasDaSemana(refDate)

  for (const agendamento of lista) {
    const dataConsulta = String(agendamento.data_consulta || '').slice(0, 10)
    const dia = dias.find((d) => d.id === dataConsulta)
    if (!dia) continue   // data fora da semana exibida

    dia.appointments.push({
      id:         agendamento.id,
      time:       formatarHorario(agendamento.horario_inicio),
      name:       agendamento.paciente,
      initials:   calcularIniciais(agendamento.paciente),
      status:     agendamento.status,
      id_triagem: agendamento.id_triagem,
      // symptoms e priority não existem na API — omitidos intencionalmente
    })
  }

  for (const dia of dias) {
    dia.appointments.sort((a, b) => a.time.localeCompare(b.time))
  }

  return dias
}

// Deriva o título 'Mês AAAA' a partir dos dias calculados.
function derivarMes(agendaDays) {
  const ref = agendaDays.find((d) => d.appointments.length > 0) || agendaDays[0]
  if (!ref) {
    const hoje = new Date()
    return `${MESES_NOME[hoje.getMonth()]} ${hoje.getFullYear()}`
  }
  const data = parseDateLocal(ref.id)
  return `${MESES_NOME[data.getMonth()]} ${data.getFullYear()}`
}

// Calcula o dia da semana (0–4, seg=0) de uma string 'YYYY-MM-DD',
// ou -1 se a data não corresponder a seg–sex.
function dowDoDia(id) {
  const data = parseDateLocal(id)
  const dow = data.getDay() // 0=dom…6=sab
  return dow >= 1 && dow <= 5 ? dow - 1 : -1  // seg=0 … sex=4
}

// ─── componente principal ─────────────────────────────────────────────────────

// onLogout é recebido do App.jsx e será conectado ao botão de sair
// quando o perfil profissional for integrado (etapa posterior).
// eslint-disable-next-line no-unused-vars
function AgendaProfissional({ onLogout }) {
  // Lista bruta retornada pela API — carregada apenas uma vez.
  const [agendamentos, setAgendamentos] = useState([])
  // Deslocamento de semana em relação a hoje: 0 = semana atual, ±n = n semanas.
  const [semanaOffset, setSemanaOffset] = useState(0)
  // Dia da semana selecionado: índice 0–4 (seg–sex).
  const [dowSelecionado, setDowSelecionado] = useState(() => {
    const dow = new Date().getDay()
    return dow >= 1 && dow <= 5 ? dow - 1 : 0
  })

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro]             = useState('')
  const [panel, setPanel]           = useState(null)
  const [hours, setHours]           = useState({ start: '08:00', end: '17:00' })

  // Carrega os agendamentos uma única vez ao montar.
  useEffect(() => {
    let cancelado = false

    async function carregarAgenda() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await api('/profissionais/me/agendamentos')
        if (cancelado) return
        setAgendamentos(Array.isArray(dados) ? dados : [])
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Não foi possível carregar a agenda.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregarAgenda()
    return () => { cancelado = true }
  }, [])

  // Data de referência da semana exibida: hoje deslocado por semanaOffset * 7 dias.
  const refDate = useMemo(() => {
    const ref = new Date()
    ref.setDate(ref.getDate() + semanaOffset * 7)
    return ref
  }, [semanaOffset])

  // Dias calculados a partir da lista bruta e da semana de referência.
  const agendaDays = useMemo(
    () => transformarAgendamentos(agendamentos, refDate),
    [agendamentos, refDate]
  )

  // Título do mês acompanha a semana exibida.
  const agendaMonth = useMemo(() => derivarMes(agendaDays), [agendaDays])

  // ID do dia selecionado: mantém o mesmo dia-da-semana ao navegar entre semanas.
  const selectedDayId = agendaDays[dowSelecionado]?.id ?? agendaDays[0]?.id ?? ''

  const selectedDay = agendaDays.find(({ id }) => id === selectedDayId) ?? agendaDays[0]

  // Ao clicar em um dia no seletor, guarda o índice (dow) para preservá-lo ao trocar de semana.
  function handleSelectDay(id) {
    const dow = dowDoDia(id)
    if (dow !== -1) setDowSelecionado(dow)
  }

  function irParaAnterior() { setSemanaOffset((n) => n - 1) }
  function irParaProxima()  { setSemanaOffset((n) => n + 1) }
  function irParaHoje() {
    setSemanaOffset(0)
    // Restaura o índice de hoje
    const dow = new Date().getDay()
    setDowSelecionado(dow >= 1 && dow <= 5 ? dow - 1 : 0)
  }

  function navigate(destination) {
    const rotas = {
      inicio:    '#profissional',
      agenda:    '#agenda-profissional',
      historico: '#historico-profissional',
      perfil:    '#perfil-profissional',
    }
    window.location.hash = rotas[destination] ?? '#profissional'
  }

  function closePanel() {
    setPanel(null)
    if (window.location.hash.startsWith('#profissional/')) {
      window.location.hash = '#agenda-profissional'
    }
  }

  function renderMain() {
    if (carregando) {
      return (
        <p className="agenda-professional__empty" role="status" aria-live="polite">
          Carregando agenda…
        </p>
      )
    }

    if (erro) {
      return (
        <p className="agenda-professional__empty" role="alert">
          {erro}
        </p>
      )
    }

    const totalConsultas   = selectedDay.appointments.length
    const totalDisponiveis = selectedDay.availableSlots.length
    const ehHoje           = selectedDay.id === dataHojeStr()

    return (
      <section aria-labelledby="agenda-day-title">
        <div className="agenda-professional__day-heading">
          <div>
            <h2 id="agenda-day-title">
              {selectedDay.weekdayName}, {selectedDay.date}
            </h2>
            <p>
              {totalConsultas} {totalConsultas === 1 ? 'consulta' : 'consultas'}
              {totalDisponiveis > 0 && ` · ${totalDisponiveis} horários livres`}
            </p>
          </div>
          {ehHoje && <span className="agenda-professional__today">Hoje</span>}
        </div>

        <div
          className="agenda-professional__entries"
          aria-label="Consultas e horários disponíveis"
        >
          {selectedDay.appointments.map((appointment) => (
            <AgendaAppointmentRow
              key={appointment.id}
              appointment={appointment}
              onOpen={(item) => setPanel({ type: 'triagem', appointment: item })}
            />
          ))}
          {selectedDay.availableSlots.map((time) => (
            <AgendaAvailableSlot key={time} time={time} />
          ))}
          {totalConsultas === 0 && totalDisponiveis === 0 && (
            <p className="agenda-professional__empty">
              Nenhuma consulta agendada para este dia.
            </p>
          )}
        </div>
      </section>
    )
  }

  return (
    <ProfessionalLayout activePage="agenda" onNavigate={navigate}>
      <div className="agenda-professional">
        <header className="agenda-professional__header">
          <div className="agenda-professional__month-row">
            <h1>{agendaMonth}</h1>
            <button
              className="agenda-professional__settings"
              type="button"
              aria-label="Configurar disponibilidade"
              onClick={() => setPanel({ type: 'horarios' })}
            >
              <ProfessionalIcon name="agendaSettings" />
            </button>
          </div>

          {/* Navegação entre semanas */}
          <div className="agenda-week-nav" role="group" aria-label="Navegar entre semanas">
            <button
              className="agenda-week-nav__btn"
              type="button"
              aria-label="Semana anterior"
              onClick={irParaAnterior}
            >
              ← Anterior
            </button>
            <button
              className="agenda-week-nav__btn agenda-week-nav__btn--hoje"
              type="button"
              aria-label="Voltar para a semana atual"
              disabled={semanaOffset === 0}
              onClick={irParaHoje}
            >
              Hoje
            </button>
            <button
              className="agenda-week-nav__btn"
              type="button"
              aria-label="Próxima semana"
              onClick={irParaProxima}
            >
              Próxima →
            </button>
          </div>

          <AgendaDaySelector
            days={agendaDays}
            selectedDayId={selectedDayId}
            onSelectDay={handleSelectDay}
          />
        </header>

        <main
          className="agenda-professional__main"
          id="professional-content"
          tabIndex={-1}
        >
          {renderMain()}
        </main>
      </div>

      {panel && (
        <ProfessionalHomePanel
          key={panel.type}
          panel={panel}
          professional={{}}
          appointments={selectedDay.appointments}
          historyRecords={[]}
          hours={hours}
          onSaveHours={setHours}
          onClose={closePanel}
        />
      )}
    </ProfessionalLayout>
  )
}

export default AgendaProfissional
