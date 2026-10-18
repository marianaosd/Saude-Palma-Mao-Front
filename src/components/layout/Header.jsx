import AccessibilityPanel from '../ui/AccessibilityPanel.jsx'

function Header({ onLogin }) {
  return (
    <header className="site-header container">
      <a className="brand" href="#inicio">
        <img src="/favicon.svg" width="36" height="36" alt="" />
        <span>Saúde na Palma da Mão</span>
      </a>

      <nav aria-label="Navegação principal">
        <a href="#proposta">A proposta</a>
        <a href="#publicos">Para quem</a>

        <button
          type="button"
          className="header-login"
          onClick={onLogin}
        >
          Entrar
        </button>

        <AccessibilityPanel />
      </nav>
    </header>
  )
}

export default Header
