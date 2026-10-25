import { useEffect, useState } from 'react'
import AppLayout from './components/layout/AppLayout.jsx'
import Home from './pages/institucional/Home.jsx'
import Login from './pages/auth/Login.jsx'
import LoginProfissional from './pages/auth/LoginProfissional.jsx'
import LoginAdmin from './pages/auth/LoginAdmin.jsx'
import Cadastro from './pages/auth/Cadastro.jsx'
import Paciente from './pages/paciente/Paciente.jsx'
import Triagem from './pages/paciente/Triagem.jsx'
import Resultado from './pages/paciente/Resultado.jsx'
import Clinicas from './pages/paciente/Clinicas.jsx'
import EscolhaProfissional from './pages/paciente/EscolhaProfissional.jsx'
import Agendamento from './pages/paciente/Agendamento.jsx'
import Confirmacao from './pages/paciente/Confirmacao.jsx'
import HomeProfissional from './pages/profissional/HomeProfissional.jsx'
import AgendaProfissional from './pages/profissional/AgendaProfissional.jsx'
import HistoricoProfissional from './pages/profissional/HistoricoProfissional.jsx'
import PerfilProfissional from './pages/profissional/PerfilProfissional.jsx'
import Admin from './pages/admin/Admin.jsx'
import {
  getUsuario,
  limparSessao,
  getProfissional,
  limparSessaoProfissional,
  getAdmin,
  limparSessaoAdmin
} from './services/api.js'

const INITIAL_JOURNEY = {
  categoria: null,
  triagem: null,
  clinica: null,
  profissional: null,
  especialidade: null,
  slot: null,
  agendamento: null
}

function screenFromHash() {
  if (window.location.hash === '#paciente') return 'paciente'
  if (window.location.hash === '#admin') return 'admin'
  if (window.location.hash === '#perfil-profissional') return 'perfil-profissional'
  if (window.location.hash === '#historico-profissional') return 'historico-profissional'
  if (window.location.hash === '#agenda-profissional') return 'agenda-profissional'
  if (window.location.hash.startsWith('#profissional')) return 'profissional'
  if (['#inicio', '#proposta', '#publicos'].includes(window.location.hash)) return 'home'
  return null
}

const TELAS_PACIENTE = ['paciente', 'triagem', 'resultado', 'clinicas', 'escolha-profissional', 'agendamento', 'confirmacao']
const TELAS_PROFISSIONAL = ['profissional', 'agenda-profissional', 'historico-profissional', 'perfil-profissional']
const TELAS_ADMIN = ['admin']

function App() {
  const [usuario, setUsuario] = useState(() => getUsuario())
  const [profissional, setProfissional] = useState(() => getProfissional())
  const [admin, setAdmin] = useState(() => getAdmin())
  const [journey, setJourney] = useState(INITIAL_JOURNEY)
  const [requestedScreen, setScreen] = useState(() => {
    const fromHash = screenFromHash()

    // Sem hash na URL: retoma a área de quem já tem sessão salva.
    // Sem sessão, a entrada do app é a tela de login.
    if (!window.location.hash) {
      if (getUsuario()) return 'paciente'
      if (getProfissional()) return 'profissional'
      if (getAdmin()) return 'admin'
      return 'login'
    }

    return fromHash || 'login'
  })

  useEffect(() => {
    function syncScreenFromHash() {
      const fromHash = screenFromHash()
      if (fromHash) setScreen(fromHash)
    }

    window.addEventListener('hashchange', syncScreenFromHash)
    return () => window.removeEventListener('hashchange', syncScreenFromHash)
  }, [])

  useEffect(() => {
    function handleSessaoExpirada() {
      setUsuario(null)
      setJourney(INITIAL_JOURNEY)
      setScreen('login')
    }

    window.addEventListener('sessao-expirada', handleSessaoExpirada)
    return () => window.removeEventListener('sessao-expirada', handleSessaoExpirada)
  }, [])

  useEffect(() => {
    function handleSessaoProfissionalExpirada() {
      setProfissional(null)
      setScreen('login-profissional')
    }

    window.addEventListener('sessao-profissional-expirada', handleSessaoProfissionalExpirada)
    return () => window.removeEventListener('sessao-profissional-expirada', handleSessaoProfissionalExpirada)
  }, [])

  useEffect(() => {
    function handleSessaoAdminExpirada() {
      setAdmin(null)
      setScreen('login-admin')
    }

    window.addEventListener('sessao-admin-expirada', handleSessaoAdminExpirada)
    return () => window.removeEventListener('sessao-admin-expirada', handleSessaoAdminExpirada)
  }, [])

  const screen =
    TELAS_PACIENTE.includes(requestedScreen) && !usuario
      ? 'login'
      : TELAS_PROFISSIONAL.includes(requestedScreen) && !profissional
        ? 'login-profissional'
        : TELAS_ADMIN.includes(requestedScreen) && !admin
          ? 'login-admin'
          : requestedScreen

  function goTo(nextScreen) {
    setScreen(nextScreen)
  }

  // Navegação entre o login e a página institucional: o hash acompanha a tela
  // para o F5 não trocar de tela (mesmo cuidado que já existe nas áreas logadas).
  function irParaLogin() {
    if (['#inicio', '#proposta', '#publicos'].includes(window.location.hash)) {
      history.replaceState(null, '', window.location.pathname)
    }
    goTo('login')
  }

  function irParaHome() {
    window.location.hash = 'inicio'
    goTo('home')
  }

  function handleLogin(paciente) {
    setUsuario(paciente)
    setJourney(INITIAL_JOURNEY)
    window.location.hash = 'paciente'
    goTo('paciente')
  }

  function handleLogout() {
    limparSessao()
    setUsuario(null)
    setJourney(INITIAL_JOURNEY)
    // Limpa o hash para não reativar a área do paciente ao recarregar
    if (window.location.hash === '#paciente') {
      history.replaceState(null, '', window.location.pathname)
    }
    goTo('login')
  }

  function handleLoginProfissional(profissionalData) {
    setProfissional(profissionalData)
    window.location.hash = 'profissional'
    goTo('profissional')
  }

  function handleLogoutProfissional() {
    limparSessaoProfissional()
    setProfissional(null)
    // Limpa o hash para não reativar o portal ao recarregar
    if (window.location.hash.startsWith('#profissional') ||
        window.location.hash.startsWith('#agenda-profissional') ||
        window.location.hash.startsWith('#historico-profissional') ||
        window.location.hash.startsWith('#perfil-profissional')) {
      history.replaceState(null, '', window.location.pathname)
    }
    goTo('login')
  }

  function handleLoginAdmin(adminData) {
    setAdmin(adminData)
    window.location.hash = 'admin'
    goTo('admin')
  }

  function handleLogoutAdmin() {
    limparSessaoAdmin()
    setAdmin(null)
    if (window.location.hash === '#admin') {
      history.replaceState(null, '', window.location.pathname)
    }
    goTo('login')
  }

  function updateJourney(partial) {
    setJourney((current) => ({ ...current, ...partial }))
  }

  if (screen === 'admin') return <Admin admin={admin} onLogout={handleLogoutAdmin} />
  if (screen === 'profissional') return <HomeProfissional onLogout={handleLogoutProfissional} />
  if (screen === 'agenda-profissional') return <AgendaProfissional onLogout={handleLogoutProfissional} />
  if (screen === 'historico-profissional') return <HistoricoProfissional onLogout={handleLogoutProfissional} />
  if (screen === 'perfil-profissional') return <PerfilProfissional onLogout={handleLogoutProfissional} />

  return (
    <AppLayout
      onLogin={irParaLogin}
      usuario={usuario}
      onLogout={handleLogout}
    >
      {screen === 'home' && (
        <Home onLogin={irParaLogin} />
      )}

      {screen === 'login' && (
        <Login
          onBack={irParaHome}
          onCadastro={() => goTo('cadastro')}
          onLogin={handleLogin}
          onLoginProfissional={() => goTo('login-profissional')}
          onLoginAdmin={() => goTo('login-admin')}
        />
      )}

      {screen === 'login-profissional' && (
        <LoginProfissional
          onBack={() => goTo('login')}
          onLogin={handleLoginProfissional}
        />
      )}

      {screen === 'login-admin' && (
        <LoginAdmin
          onBack={() => goTo('login')}
          onLogin={handleLoginAdmin}
        />
      )}

      {screen === 'cadastro' && (
        <Cadastro
          onBack={() => goTo('login')}
          onCadastro={handleLogin}
          onLoginProfissional={() => goTo('login-profissional')}
        />
      )}

      {screen === 'paciente' && (
        <Paciente
          usuario={usuario}
          onTriagem={() => goTo('triagem')}
          onClinicas={() => goTo('clinicas')}
          onBack={handleLogout}
        />
      )}

      {screen === 'triagem' && (
        <Triagem
          onBack={() => goTo('paciente')}
          onResultado={(resultado) => {
            updateJourney(resultado)
            goTo('resultado')
          }}
        />
      )}

      {screen === 'resultado' && (
        <Resultado
          categoria={journey.categoria}
          classificacao={journey.classificacao}
          onBack={() => goTo('triagem')}
          onClinicas={() => goTo('clinicas')}
        />
      )}

      {screen === 'clinicas' && (
        <Clinicas
          onBack={() => goTo(journey.categoria ? 'resultado' : 'paciente')}
          onSelecionar={(clinica) => {
            updateJourney({ clinica, profissional: null, especialidade: null, slot: null })
            goTo('escolha-profissional')
          }}
        />
      )}

      {screen === 'escolha-profissional' && (
        <EscolhaProfissional
          clinica={journey.clinica}
          onBack={() => goTo('clinicas')}
          onAgendar={({ profissional, especialidade, slot }) => {
            updateJourney({ profissional, especialidade, slot })
            goTo('agendamento')
          }}
        />
      )}

      {screen === 'agendamento' && (
        <Agendamento
          clinica={journey.clinica}
          profissional={journey.profissional}
          especialidade={journey.especialidade}
          slot={journey.slot}
          triagem={journey.triagem}
          onBack={() => goTo('escolha-profissional')}
          onConfirmar={(agendamento) => {
            updateJourney({ agendamento })
            goTo('confirmacao')
          }}
        />
      )}

      {screen === 'confirmacao' && (
        <Confirmacao
          clinica={journey.clinica}
          profissional={journey.profissional}
          especialidade={journey.especialidade}
          slot={journey.slot}
          onPaciente={() => {
            setJourney(INITIAL_JOURNEY)
            goTo('paciente')
          }}
          onHome={() => {
            setJourney(INITIAL_JOURNEY)
            irParaHome()
          }}
        />
      )}
    </AppLayout>
  )
}

export default App
