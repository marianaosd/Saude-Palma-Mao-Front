import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import './App.css'

function App() {
  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo" className="container" tabIndex={-1}>
        <Home />
      </main>
      <footer className="site-footer container">
        <p>Saúde na Palma da Mão</p>
        <p>Projeto Integrador · 3º período</p>
      </footer>
    </>
  )
}

export default App
