import { useState } from 'react'
import { api, salvarSessaoProfissional } from '../../services/api.js'
import './Auth.css'

function LoginProfissional({ onBack, onLogin, onEsqueciSenha }) {
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
      const resposta = await api('/auth/profissional/login', {
        method: 'POST',
        body: JSON.stringify({ email, senha })
      })

      salvarSessaoProfissional(resposta.token, resposta.profissional)
      onLogin(resposta.profissional)
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-page" aria-labelledby="login-profissional-title">
      <div className="auth-card">
        <p className="eyebrow">Desafila</p>

        <h1 id="login-profissional-title">Acesso profissional</h1>

        <p className="auth-description">
          Entre com as credenciais fornecidas pela clínica.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="prof-email">E-mail</label>
            <input
              id="prof-email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              autoComplete="email"
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="prof-password">Senha</label>
            <input
              id="prof-password"
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

        <p className="auth-description" style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          O cadastro de profissionais é realizado pela administração da clínica.
        </p>

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

export default LoginProfissional
