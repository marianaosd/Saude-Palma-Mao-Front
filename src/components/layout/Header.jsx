import AccessibilityPanel from '../ui/AccessibilityPanel.jsx'

// variant="entrada" é a versão enxuta usada nas telas de login e cadastro:
// marca + acessibilidade, sem o menu institucional. O botão "Entrar" também
// sai, porque não faz sentido aparecer na própria tela de login.
function Header({ onLogin, variant = 'institucional' }) {
  const entrada = variant === 'entrada'

  return (
    <header className="site-header container">
      <a className="brand" href="#inicio">
        <img src="/favicon.svg" width="36" height="36" alt="" />
        <span>Desafila</span>
      </a>

      {entrada ? (
        <div className="site-header__access">
          <AccessibilityPanel />
        </div>
      ) : (
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
      )}
    </header>
  )
}

export default Header