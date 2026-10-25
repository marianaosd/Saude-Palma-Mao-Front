import Header from './Header.jsx'
import './AppLayout.css'

// Estrutura atual do protótipo; os layouts por perfil serão desenvolvidos depois.
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

      <footer className="site-footer container">
        <p>Desafila</p>
        <p>Projeto Integrador · 3º período</p>
      </footer>
    </>
  )
}

export default AppLayout
