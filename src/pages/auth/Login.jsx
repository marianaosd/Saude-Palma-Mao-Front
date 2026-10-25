import { useState } from 'react'
import { api, salvarSessao } from '../../services/api.js'
import './Auth.css'

function Login({ onBack, onCadastro, onLogin, onLoginProfissional, onLoginAdmin }) {
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')
    setEnviando(true)

    const form = new FormData(event.currentTarget)
    const email = String(form.get('email') || '').trim()
    const senha = String(form.get('password') || '')

    try {
      const resposta = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      })

      salvarSessao(resposta.token, resposta.paciente)
      onLogin(resposta.paciente)
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <div className="auth-card">
        <p className="eyebrow">Desafila</p>

        <h1 id="login-title">Bem-vindo de volta</h1>

        <p className="auth-description">
          Entre na sua conta para continuar sua jornada de atendimento.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          {erro && <p className="app-feedback error" role="alert">{erro}</p>}

          <button type="submit" className="primary-button" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className="auth-footer">
          Ainda não tem uma conta?{' '}
          <button
            type="button"
            className="auth-link-button"
            onClick={onCadastro}
          >
            Criar conta
          </button>
        </p>

        <p className="professional-login-link">
          <button
            type="button"
            className="auth-link-button"
            onClick={onLoginProfissional}
          >
            Entrar como profissional
          </button>
        </p>

        <p className="professional-login-link">
          <button
            type="button"
            className="auth-link-button"
            onClick={onLoginAdmin}
          >
            Acesso administrativo
          </button>
        </p>

        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Conheça o projeto
        </button>
      </div>
    </section>
  )
}

export default Login
