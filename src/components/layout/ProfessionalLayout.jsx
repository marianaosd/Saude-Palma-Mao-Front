import ProfessionalIcon from '../profissional/ProfessionalIcon.jsx'
import './ProfessionalLayout.css'

const destinations = [
  { id: 'inicio', label: 'Início', icon: 'homeActive' },
  { id: 'agenda', label: 'Agenda', icon: 'calendarNav' },
  { id: 'historico', label: 'Histórico', icon: 'historyNav' },
  { id: 'perfil', label: 'Perfil', icon: 'profileNav' },
]

function ProfessionalLayout({ children, onNavigate }) {
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
            className={`professional-bottom-nav__item${id === 'inicio' ? ' professional-bottom-nav__item--active' : ''}`}
            aria-current={id === 'inicio' ? 'page' : undefined}
            onClick={() => onNavigate(id)}
          >
            <ProfessionalIcon name={icon} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default ProfessionalLayout
