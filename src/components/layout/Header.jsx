import AccessibilityPanel from '../ui/AccessibilityPanel.jsx'

// Header das telas públicas.
// - variant="institucional" (Home): marca + menu + "Entrar" + acessibilidade.
// - variant="entrada" (login e cadastro): só marca + acessibilidade, sem menu
//   (o botão "Entrar" não faz sentido na própria tela de login).
// A acessibilidade é irmã do menu, e não filha dele, para poder subir para a
// primeira linha no celular sem arrastar o menu junto.
function Header({ onLogin, variant = 'institucional' }) {
  const entrada = variant === 'entrada'

  return (
    <header className="site-header container">
      <a className="brand" href="#inicio">
        <img src="/favicon.svg" width="36" height="36" alt="" />
        <span>Desafila</span>
      </a>

      {!entrada && (
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
        </nav>
      )}

      <div className="site-header__access">
        <AccessibilityPanel />
      </div>
    </header>
  )
}

export default Header