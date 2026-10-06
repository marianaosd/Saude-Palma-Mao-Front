import { useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import AgendaAppointmentRow from '../../components/profissional/agendaProfissional/AgendaAppointmentRow.jsx'
import AgendaAvailableSlot from '../../components/profissional/agendaProfissional/AgendaAvailableSlot.jsx'
import AgendaDaySelector from '../../components/profissional/agendaProfissional/AgendaDaySelector.jsx'
import ProfessionalHomePanel from '../../components/profissional/ProfessionalHomePanel.jsx'
import { agendaDays, agendaMonth } from '../../data/agendaProfissional.js'
import { professional, professionalHistory } from '../../data/profissional.js'
import './AgendaProfissional.css'

function AgendaProfissional() {
  const [selectedDayId, setSelectedDayId] = useState(agendaDays[0].id)
  const [panel, setPanel] = useState(null)
  const [hours, setHours] = useState({ start: '08:00', end: '17:00' })
  const selectedDay = agendaDays.find(({ id }) => id === selectedDayId) ?? agendaDays[0]

  function navigate(destination) {
    if (destination === 'inicio' || destination === 'agenda') {
      window.location.hash = destination === 'inicio' ? '#profissional' : '#agenda-profissional'
    } else if (destination === 'historico') {
      window.location.hash = '#historico-profissional'
    } else if (destination === 'perfil') {
      window.location.hash = `#profissional/${destination}`
    } else {
      window.location.hash = '#profissional'
    }
  }

  function closePanel() {
    setPanel(null)
    if (window.location.hash.startsWith('#profissional/')) window.location.hash = '#agenda-profissional'
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
          <AgendaDaySelector
            days={agendaDays}
            selectedDayId={selectedDayId}
            onSelectDay={setSelectedDayId}
          />
        </header>

        <main className="agenda-professional__main" id="professional-content" tabIndex={-1}>
          <section aria-labelledby="agenda-day-title">
            <div className="agenda-professional__day-heading">
              <div>
              <h2 id="agenda-day-title">{selectedDay.weekdayName}, {selectedDay.date}</h2>
                <p>
                  {selectedDay.appointments.length} consultas · {selectedDay.availableCount} horários livres
                </p>
              </div>
              <span className="agenda-professional__today">Hoje</span>
            </div>

            <div className="agenda-professional__entries" aria-label="Consultas e horários disponíveis">
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
              {selectedDay.appointments.length === 0 && selectedDay.availableSlots.length === 0 && (
                <p className="agenda-professional__empty">Nenhuma consulta ou horário livre neste dia.</p>
              )}
            </div>
          </section>
        </main>
      </div>

      {panel && (
        <ProfessionalHomePanel
          key={panel.type}
          panel={panel}
          professional={professional}
          appointments={selectedDay.appointments}
          historyRecords={professionalHistory}
          hours={hours}
          onSaveHours={setHours}
          onClose={closePanel}
        />
      )}
    </ProfessionalLayout>
  )
}

export default AgendaProfissional
