import { useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import AppointmentCard from '../../components/profissional/AppointmentCard.jsx'
import ProfessionalHomePanel from '../../components/profissional/ProfessionalHomePanel.jsx'
import {
  appointmentDay,
  professional,
  professionalAppointments,
  professionalHistory,
} from '../../data/profissional.js'
import './HomeProfissional.css'

const quickActions = [
  { id: 'agenda', icon: 'calendarAction', label: 'Ver agenda' },
  { id: 'horarios', icon: 'settings', label: 'Configurar horários' },
  { id: 'historico', icon: 'historyAction', label: 'Histórico' },
]

function getInitialPanel() {
  const panelType = window.location.hash.match(/^#profissional\/(perfil)$/)?.[1]
  return panelType ? { type: panelType } : null
}

function HomeProfissional() {
  const [available, setAvailable] = useState(true)
  const [panel, setPanel] = useState(getInitialPanel)
  const [hours, setHours] = useState({ start: '08:00', end: '17:00' })
  const upcomingAppointments = professionalAppointments.slice(0, 3)

  function navigate(destination) {
    if (destination === 'inicio') {
      if (window.location.hash !== '#profissional') window.location.hash = '#profissional'
      document.getElementById('professional-content').focus({ preventScroll: true })
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

  return (
    <ProfessionalLayout
      activePage={panel?.type === 'perfil' ? panel.type : 'inicio'}
      onNavigate={navigate}
    >
      <header className="professional-header">
        <div className="professional-header__identity">
          <div className="professional-header__person">
            <div className="professional-header__avatar" aria-hidden="true">
              {professional.initials}
            </div>
            <div className="professional-header__introduction">
              <p className="professional-header__greeting">Olá,</p>
              <h1>{professional.name}</h1>
              <p className="professional-header__credentials">
                {professional.specialty} · {professional.registration}
              </p>
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
            <span className="professional-availability__dot" aria-hidden="true" />
            {available ? 'Ativo' : 'Inativo'}
          </span>
        </button>
      </header>

      <main className="professional-home" id="professional-content" tabIndex={-1}>
        <button className="professional-summary" type="button" onClick={() => navigate('agenda')}>
          <span className="professional-summary__icon">
            <ProfessionalIcon name="calendarSummary" />
          </span>
          <span className="professional-summary__content">
            <span className="professional-summary__eyebrow">Resumo de hoje</span>
            <span className="professional-summary__title">
              {professionalAppointments.length} consultas agendadas
            </span>
            <span className="professional-summary__next">
              Próxima às {professionalAppointments[0].time}
            </span>
          </span>
          <ProfessionalIcon name="chevronRight" />
        </button>

        <div className="professional-quick-actions" role="group" aria-label="Acesso rápido">
          {quickActions.map(({ id, icon, label }) => (
            <button key={id} className="professional-quick-action" type="button" onClick={() => navigate(id)}>
              <span className="professional-quick-action__icon">
                <ProfessionalIcon name={icon} />
              </span>
              <span className="professional-quick-action__label">{label}</span>
            </button>
          ))}
        </div>

        <section className="professional-appointments" aria-labelledby="upcoming-title">
          <div className="professional-appointments__heading">
            <div>
              <h2 id="upcoming-title">Próximas consultas</h2>
              <p>{appointmentDay}</p>
            </div>
            <button className="professional-view-all" type="button" onClick={() => navigate('agenda')}>
              Ver todas
            </button>
          </div>
          <div className="professional-appointments__list">
            {upcomingAppointments.map((appointment, index) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                highlighted={index === 0}
                onViewTriage={viewTriage}
              />
            ))}
          </div>
        </section>
      </main>

      {panel && (
        <ProfessionalHomePanel
          key={panel.type}
          panel={panel}
          professional={professional}
          appointments={professionalAppointments}
          historyRecords={professionalHistory}
          hours={hours}
          onSaveHours={setHours}
          onClose={closePanel}
        />
      )}
    </ProfessionalLayout>
  )
}

export default HomeProfissional
