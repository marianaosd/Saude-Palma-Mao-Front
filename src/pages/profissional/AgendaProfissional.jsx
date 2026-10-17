
import { useEffect, useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import AgendaAppointmentRow from '../../components/profissional/agendaProfissional/AgendaAppointmentRow.jsx'
import AgendaAvailableSlot from '../../components/profissional/agendaProfissional/AgendaAvailableSlot.jsx'
import AgendaDaySelector from '../../components/profissional/agendaProfissional/AgendaDaySelector.jsx'
import ProfessionalHomePanel from '../../components/profissional/ProfessionalHomePanel.jsx'
import { api } from '../../services/api.js'
import './AgendaProfissional.css'

// ─── Helpers de data ────────────────────────────────────────────────────────

const DIAS_SEMANA_ABREV = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB']

const DIAS_SEMANA_NOME = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
]

const MESES_NOME = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

// Converte YYYY-MM-DD em uma data local sem deslocamento de fuso horário.
function parseDateLocal(dateStr) {
  const [year, month, day] = String(dateStr).slice(0, 10).split('-').map(Number)
  return new Date(year, month - 1, day)
}

// Calcula as iniciais de um nome completo.
function calcularIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean)

  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()

  return (
    partes[0][0] + partes[partes.length - 1][0]
  ).toUpperCase()
}

// Converte HH:MM:SS para HH:MM.
function formatarHorario(horario) {
  return String(horario || '').slice(0, 5)
}

// Monta os cinco dias úteis da semana que contém a data informada.
function diasDaSemana(refDate) {
  const dow = refDate.getDay()
  const diffParaSeg = dow === 0 ? -6 : 1 - dow

  const segunda = new Date(refDate)
  segunda.setDate(refDate.getDate() + diffParaSeg)

  return Array.from({ length: 5 }, (_, i) => {
    const data = new Date(segunda)
    data.setDate(segunda.getDate() + i)

    const yyyy = data.getFullYear()
    const mm = String(data.getMonth() + 1).padStart(2, '0')
    const dd = String(data.getDate()).padStart(2, '0')

    return {
      id: `${yyyy}-${mm}-${dd}`,
      weekday: DIAS_SEMANA_ABREV[data.getDay()],
      weekdayName: DIAS_SEMANA_NOME[data.getDay()],
      date: data.getDate(),
      appointments: [],
      availableSlots: [],
    }
  })
}

// Transforma os agendamentos da API nos dados esperados pela agenda.
function transformarAgendamentos(agendamentos) {
  // CORREÇÃO: abre a semana atual, em vez da semana do agendamento mais antigo.
  const dias = diasDaSemana(new Date())

  for (const agendamento of agendamentos) {
    const dataConsulta = String(agendamento.data_consulta || '').slice(0, 10)

    const dia = dias.find((item) => item.id === dataConsulta)

    // Ignora apenas consultas que não pertencem à semana exibida.
    if (!dia) continue

    dia.appointments.push({
      id: agendamento.id,
      time: formatarHorario(agendamento.horario_inicio),
      name: agendamento.paciente,
      initials: calcularIniciais(agendamento.paciente),
      status: agendamento.status,
      id_triagem: agendamento.id_triagem,
    })
  }

  // Ordena as consultas de cada dia pelo horário.
  for (const dia of dias) {
    dia.appointments.sort((a, b) => a.time.localeCompare(b.time))
  }

  return dias
}

// Define o título do mês da agenda.
function derivarMes(agendaDays) {
  const comAgendamentos = agendaDays.filter(
    (dia) => dia.appointments.length > 0
  )

  const referencia = comAgendamentos[0] || agendaDays[0]

  if (!referencia) {
    const hoje = new Date()
    return `${MESES_NOME[hoje.getMonth()]} ${hoje.getFullYear()}`
  }

  const data = parseDateLocal(referencia.id)

  return `${MESES_NOME[data.getMonth()]} ${data.getFullYear()}`
}

// ─── Componente principal ───────────────────────────────────────────────────

function AgendaProfissional() {
  const [agendaDays, setAgendaDays] = useState(() => diasDaSemana(new Date()))

  const [agendaMonth, setAgendaMonth] = useState(() => {
    const hoje = new Date()
    return `${MESES_NOME[hoje.getMonth()]} ${hoje.getFullYear()}`
  })

  const [selectedDayId, setSelectedDayId] = useState(() => {
    const hoje = new Date()
    const dow = hoje.getDay()
    const dias = diasDaSemana(hoje)

    // Seleciona hoje de segunda a sexta; no fim de semana, seleciona segunda.
    const diaInicial = dow === 0 || dow === 6 ? dias[0] : dias[dow - 1]

    return diaInicial.id
  })

  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [panel, setPanel] = useState(null)
  const [hours, setHours] = useState({ start: '08:00', end: '17:00' })

  useEffect(() => {
    let cancelado = false

    async function carregarAgenda() {
      setCarregando(true)
      setErro('')

      try {
        const dados = await api('/profissionais/me/agendamentos')

        if (cancelado) return

        const dias = transformarAgendamentos(
          Array.isArray(dados) ? dados : []
        )

        setAgendaDays(dias)
        setAgendaMonth(derivarMes(dias))

        // Mantém o dia selecionado se ele existir na semana atual.
        // Caso contrário, seleciona o dia de hoje ou segunda-feira.
        setSelectedDayId((atual) => {
          const existe = dias.some((dia) => dia.id === atual)

          if (existe) return atual

          const hoje = new Date()
          const dow = hoje.getDay()
          const diaInicial = dow === 0 || dow === 6
            ? dias[0]
            : dias[dow - 1]

          return diaInicial.id
        })
      } catch (e) {
        if (!cancelado) {
          setErro(e.message || 'Não foi possível carregar a agenda.')
        }
      } finally {
        if (!cancelado) {
          setCarregando(false)
        }
      }
    }

    carregarAgenda()

    return () => {
      cancelado = true
    }
  }, [])

  const selectedDay =
    agendaDays.find(({ id }) => id === selectedDayId) || agendaDays[0]

  function navigate(destination) {
    if (destination === 'inicio' || destination === 'agenda') {
      window.location.hash =
        destination === 'inicio' ? '#profissional' : '#agenda-profissional'
    } else if (destination === 'historico') {
      window.location.hash = '#historico-profissional'
    } else if (destination === 'perfil') {
      window.location.hash = '#perfil-profissional'
    } else {
      window.location.hash = '#profissional'
    }
  }

  function closePanel() {
    setPanel(null)

    if (window.location.hash.startsWith('#profissional/')) {
      window.location.hash = '#agenda-profissional'
    }
  }

  // Renderiza o conteúdo principal conforme o estado da agenda.
  function renderMain() {
    if (carregando) {
      return (
        <p
          className="agenda-professional__empty"
          role="status"
          aria-live="polite"
        >
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

    const totalConsultas = selectedDay.appointments.length
    const totalDisponiveis = selectedDay.availableSlots.length

    const hoje = new Date()
    const dataHoje =
      `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`

    const diaSelecionadoEhHoje = selectedDay.id === dataHoje

    return (
      <section aria-labelledby="agenda-day-title">
        <div className="agenda-professional__day-heading">
          <div>
            <h2 id="agenda-day-title">
              {selectedDay.weekdayName}, {selectedDay.date}
            </h2>

            <p>
              {totalConsultas}{' '}
              {totalConsultas === 1 ? 'consulta' : 'consultas'}
              {totalDisponiveis > 0 &&
                ` · ${totalDisponiveis} horários livres`}
            </p>
          </div>

          {diaSelecionadoEhHoje && (
            <span className="agenda-professional__today">Hoje</span>
          )}
        </div>

        <div
          className="agenda-professional__entries"
          aria-label="Consultas e horários disponíveis"
        >
          {selectedDay.appointments.map((appointment) => (
            <AgendaAppointmentRow
              key={appointment.id}
              appointment={appointment}
              onOpen={(item) =>
                setPanel({ type: 'triagem', appointment: item })
              }
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
    <ProfessionalLayout
      activePage="agenda"
      onNavigate={navigate}
    >
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

          <AgendaDaySelector
            days={agendaDays}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
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
