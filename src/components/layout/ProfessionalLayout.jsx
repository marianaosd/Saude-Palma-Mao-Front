import ProfessionalIcon from '../profissional/ProfessionalIcon.jsx'
import './ProfessionalLayout.css'

const destinations = [
  { id: 'inicio', label: 'Início', icon: 'homeActive' },
  { id: 'agenda', label: 'Agenda', icon: 'calendarNav' },
  { id: 'historico', label: 'Histórico', icon: 'historyNav' },
  { id: 'perfil', label: 'Perfil', icon: 'profileNav' },
]

const agendaIcons = {
  inicio: 'agendaHomeNav',
  agenda: 'agendaCalendarNav',
  historico: 'agendaHistoryNav',
  perfil: 'agendaProfileNav',
}

const historyIcons = {
  inicio: 'historyHomeNav',
  agenda: 'historyAgendaNav',
  historico: 'historyActiveNav',
  perfil: 'historyProfileNav',
}

const profileIcons = {
  inicio: 'profileHomeNav',
  agenda: 'profileAgendaNav',
  historico: 'profileHistoryNav',
  perfil: 'profileActiveNav',
}

function ProfessionalLayout({ children, onNavigate, activePage = 'inicio' }) {
  return (
    <div className="professional-shell theme-figma">
      <a className="professional-skip-link" href="#professional-content">
        Pular para o conteúdo
      </a>
      {children}
      <nav className="professional-bottom-nav" aria-label="Navegação profissional">
        {destinations.map(({ id, label, icon }) => (
          <button
            key={id}
            type="button"
            className={`professional-bottom-nav__item${id === activePage ? ' professional-bottom-nav__item--active' : ''}`}
            aria-current={id === activePage ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <ProfessionalIcon
              name={activePage === 'agenda'
                ? agendaIcons[id]
                : activePage === 'historico'
                  ? historyIcons[id]
                  : activePage === 'perfil'
                    ? profileIcons[id]
                    : icon}
            />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ProfessionalLayout
