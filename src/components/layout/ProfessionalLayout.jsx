import ProfessionalIcon from '../profissional/ProfessionalIcon.jsx'
import AccessibilityPanel from '../ui/AccessibilityPanel.jsx'
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

function ProfessionalLayout({ children, onNavigate, onLogout, activePage = 'inicio' }) {
  return (
    <div className="professional-shell theme-figma">
      <a className="professional-skip-link" href="#professional-content">
        Pular para o conteúdo
      </a>

      <header className="professional-topbar">
        <div className="professional-topbar__content">
          <a className="professional-topbar__brand" href="#profissional">
            <img src="/favicon.svg" width="32" height="32" alt="" />
            <span>Desafila</span>
          </a>

          <div className="professional-topbar__actions">
            <AccessibilityPanel />

            <button
              type="button"
              className="professional-topbar__logout"
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="professional-tabs" aria-label="Navegação profissional">
        <div className="professional-tabs__content">
          {destinations.map(({ id, label, icon }) => (
            <button
              key={id}
              type="button"
              className={`professional-tabs__item${id === activePage ? ' professional-tabs__item--active' : ''}`}
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
        </div>
      </nav>

      <main id="professional-content" className="professional-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}

export default ProfessionalLayout
