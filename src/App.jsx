import { useEffect, useState } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import Home from './pages/institucional/Home.jsx'
import Login from './pages/auth/Login.jsx'
import Cadastro from './pages/auth/Cadastro.jsx'
import Paciente from './pages/paciente/Paciente.jsx'
import Triagem from './pages/paciente/Triagem.jsx'
import Resultado from './pages/paciente/Resultado.jsx'
import Clinicas from './pages/paciente/Clinicas.jsx'
import EscolhaProfissional from './pages/paciente/EscolhaProfissional.jsx'
import Agendamento from './pages/paciente/Agendamento.jsx'
import Confirmacao from './pages/paciente/Confirmacao.jsx'
import HomeProfissional from './pages/profissional/HomeProfissional.jsx'

function App() {
  const [screen, setScreen] = useState(() => (
    window.location.hash === '#profissional' ? 'profissional' : 'home'
  ))

  useEffect(() => {
    function syncScreenFromHash() {
      if (window.location.hash === '#profissional') {
        setScreen('profissional')
      } else if (['', '#inicio', '#proposta', '#publicos'].includes(window.location.hash)) {
        setScreen('home')
      }
    }

    window.addEventListener('hashchange', syncScreenFromHash)
    return () => window.removeEventListener('hashchange', syncScreenFromHash)
  }, [])

  if (screen === 'profissional') return <HomeProfissional />

  return (
    <AppLayout onLogin={() => setScreen('login')}>
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
          onSelecionar={() => setScreen('escolha-profissional')}
        />
      )}

      {screen === 'escolha-profissional' && (
        <EscolhaProfissional
          onBack={() => setScreen('clinicas')}
          onAgendar={() => setScreen('agendamento')}
        />
      )}

      {screen === 'agendamento' && (
        <Agendamento
          onBack={() => setScreen('escolha-profissional')}
          onConfirmar={() => setScreen('confirmacao')}
        />
      )}

      {screen === 'confirmacao' && (
        <Confirmacao
          onPaciente={() => setScreen('paciente')}
          onHome={() => setScreen('home')}
        />
      )}
    </AppLayout>
  )
}

export default App
