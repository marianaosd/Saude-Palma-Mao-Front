import { useState } from 'react'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Cadastro from './pages/Cadastro.jsx'
import Paciente from './pages/Paciente.jsx'
import Triagem from './pages/Triagem.jsx'
import Resultado from './pages/Resultado.jsx'
import Clinicas from './pages/Clinicas.jsx'
import Profissional from './pages/Profissional.jsx'
import Agendamento from './pages/Agendamento.jsx'
import Confirmacao from './pages/Confirmacao.jsx'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home')

  return (
    <>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>

      <Header onLogin={() => setScreen('login')} />

      <main id="conteudo" className="container" tabIndex={-1}>
        {screen === 'home' && (
          <Home onLogin={() => setScreen('login')} />
        )}

        {screen === 'login' && (
          <Login
            onBack={() => setScreen('home')}
            onCadastro={() => setScreen('cadastro')}
            onLogin={() => setScreen('paciente')}
          />
        )}

        {screen === 'cadastro' && (
          <Cadastro
            onBack={() => setScreen('login')}
          />
        )}

        {screen === 'paciente' && (
          <Paciente
            onTriagem={() => setScreen('triagem')}
            onBack={() => setScreen('home')}
          />
        )}

        {screen === 'triagem' && (
          <Triagem
            onBack={() => setScreen('paciente')}
            onResultado={() => setScreen('resultado')}
          />
        )}

        {screen === 'resultado' && (
          <Resultado
            onBack={() => setScreen('triagem')}
            onClinicas={() => setScreen('clinicas')}
          />
        )}

        {screen === 'clinicas' && (
          <Clinicas
            onBack={() => setScreen('resultado')}
            onSelecionar={() => setScreen('profissional')}
          />
        )}

        {screen === 'profissional' && (
          <Profissional
            onBack={() => setScreen('clinicas')}
            onAgendar={() => setScreen('agendamento')}
          />
        )}

        {screen === 'agendamento' && (
          <Agendamento
            onBack={() => setScreen('profissional')}
            onConfirmar={() => setScreen('confirmacao')}
          />
        )}

        {screen === 'confirmacao' && (
          <Confirmacao
            onPaciente={() => setScreen('paciente')}
            onHome={() => setScreen('home')}
          />
        )}
      </main>

      <footer className="site-footer container">
        <p>Saúde na Palma da Mão</p>
        <p>Projeto Integrador · 3º período</p>
      </footer>
    </>
  )
}

export default App
