import AccessibilityPanel from '../ui/AccessibilityPanel.jsx'
import './PatientLayout.css'

/* Ícones das abas em SVG inline: herdam a cor do texto (currentColor), então a
   aba ativa não precisa de um arquivo de ícone só para ela, como acontece no
   portal profissional. Traços reaproveitados dos ícones de lá. */
const icons = {
  inicio: (
    <svg viewBox="0 0 19.9847 19.9847" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2.49809 9.15965L9.99235 2.49809L17.4866 9.15965M4.16348 8.32696V17.4866H15.8212V8.32696M7.49426 17.4866V11.6577H12.4904V17.4866"
        stroke="currentColor"
        strokeWidth="1.49885"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  historico: (
    <svg viewBox="0 0 19.9847 19.9847" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2.49809 9.99235C2.49652 11.7086 3.08406 13.3733 4.1625 14.7084C5.24094 16.0435 6.74494 16.968 8.42312 17.3273C10.1013 17.6867 11.852 17.4592 13.3826 16.6828C14.9131 15.9064 16.1309 14.6282 16.8322 13.0618C17.5336 11.4954 17.6761 9.7358 17.2359 8.07699C16.7957 6.41817 15.7995 4.9607 14.4138 3.94816C13.0281 2.93563 11.3368 2.42939 9.62267 2.51405C7.90853 2.5987 6.27538 3.26914 4.99618 4.41329L2.49809 6.66157M6.66157 6.66157H2.49809V2.49809M9.99235 5.82887V9.99235L12.4904 11.6577"
        stroke="currentColor"
        strokeWidth="1.49885"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  perfil: (
    <svg viewBox="0 0 19.9847 19.9847" width="20" height="20" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M9.99235 9.15965C11.8319 9.15965 13.3231 7.66841 13.3231 5.82887C13.3231 3.98933 11.8319 2.49809 9.99235 2.49809C8.15281 2.49809 6.66157 3.98933 6.66157 5.82887C6.66157 7.66841 8.15281 9.15965 9.99235 9.15965Z"
        stroke="currentColor"
        strokeWidth="1.49885"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.16348 17.4866V15.8212C4.16348 14.2753 4.77759 12.7927 5.87072 11.6996C6.96384 10.6065 8.44644 9.99235 9.99235 9.99235C11.5383 9.99235 13.0209 10.6065 14.114 11.6996C15.2071 12.7927 15.8212 14.2753 15.8212 15.8212V17.4866M7.49426 12.4904L9.99235 14.9885M9.99235 14.9885L12.4904 12.4904M9.99235 14.9885V17.4866"
        stroke="currentColor"
        strokeWidth="1.49885"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

const destinations = [
  { id: 'inicio', label: 'Início' },
  { id: 'historico', label: 'Histórico' },
  { id: 'perfil', label: 'Perfil' },
]

// Casca da área do paciente, no mesmo desenho da área do profissional:
// cabeçalho com a marca + acessibilidade + Sair, abas no topo e conteúdo
// numa coluna centralizada. O fluxo de agendamento também usa esta casca.
function PatientLayout({ children, onNavigate, onLogout, activePage = 'inicio' }) {
  return (
    <div className="patient-shell">
      <a className="patient-skip-link" href="#patient-content">
        Pular para o conteúdo
      </a>

      <header className="patient-topbar">
        <div className="patient-topbar__content">
          <a className="patient-topbar__brand" href="#paciente">
            <img src="/favicon.svg" width="32" height="32" alt="" />
            <span>Desafila</span>
          </a>

          <div className="patient-topbar__actions">
            <AccessibilityPanel />

            <button
              type="button"
              className="patient-topbar__logout"
              onClick={onLogout}
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <nav className="patient-tabs" aria-label="Navegação do paciente">
        <div className="patient-tabs__content">
          {destinations.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`patient-tabs__item${id === activePage ? ' patient-tabs__item--active' : ''}`}
              aria-current={id === activePage ? 'page' : undefined}
              onClick={() => onNavigate(id)}
            >
              {icons[id]}
              <span>{label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main id="patient-content" className="patient-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  )
}

export default PatientLayout
