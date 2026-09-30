function Login({ onBack, onCadastro, onLogin }) {
  function handleSubmit(event) {
    event.preventDefault()
    onLogin()
  }

  return (
    <section className="auth-page" aria-labelledby="login-title">
      <div className="auth-card">
        <p className="eyebrow">Saúde na Palma da Mão</p>

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
            />
          </div>

          <button type="submit" className="primary-button">
            Entrar
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

        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar ao início
        </button>
      </div>
    </section>
  )
}

export default Login