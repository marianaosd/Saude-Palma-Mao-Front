import { useState } from 'react'
import { api, salvarSessaoAdmin } from '../../services/api.js'
import './Auth.css'

function LoginAdmin({ onBack, onLogin, onEsqueciSenha }) {
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
      const resposta = await api('/auth/admin/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      })

      salvarSessaoAdmin(resposta.token, resposta.admin)
      onLogin(resposta.admin)
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-page" aria-labelledby="login-admin-title">
      <div className="auth-card">
        <p className="eyebrow">Desafila</p>

        <h1 id="login-admin-title">Acesso administrativo</h1>

        <p className="auth-description">
          Área restrita à administração da plataforma.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="admin-email">E-mail</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="admin-password">Senha</label>
            <input
              id="admin-password"
              name="password"
              type="password"
              placeholder="Digite sua senha"
              autoComplete="current-password"
              required
            />
          </div>

          <p className="auth-forgot">
            <button
              type="button"
              className="auth-link-button"
              onClick={onEsqueciSenha}
            >
              Esqueci minha senha
            </button>
          </p>

          {erro && (
            <p className="app-feedback error" role="alert">
              {erro}
            </p>
          )}

          <button type="submit" className="primary-button" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar ao login
        </button>
      </div>
    </section>
  )
}

export default LoginAdmin
