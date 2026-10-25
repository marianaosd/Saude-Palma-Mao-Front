import Header from './Header.jsx'
import './AppLayout.css'

// Estrutura das telas públicas. O variant "entrada" é repassado ao Header
// pelas telas de login e cadastro; a Home institucional usa o padrão.
function AppLayout({ children, onLogin, variant = 'institucional' }) {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header onLogin={onLogin} variant={variant} />

      <main id="conteudo" className="container" tabIndex={-1}>
        {children}
      </main>
    </>
  )
}

export default AppLayout
