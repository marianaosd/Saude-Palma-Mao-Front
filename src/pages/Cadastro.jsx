function Cadastro({ onBack }) {
  return (
    <section className="auth-page" aria-labelledby="cadastro-title">
      <div className="auth-card">
        <p className="eyebrow">Saúde na Palma da Mão</p>

        <h1 id="cadastro-title">Crie sua conta</h1>

        <p className="auth-description">
          Cadastre-se para começar sua jornada de atendimento.
        </p>

        <form className="auth-form">
          <div className="form-field">
            <label htmlFor="name">Nome completo</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Digite seu nome completo"
              autoComplete="name"
            />
          </div>

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

          <fieldset className="form-field account-type">
            <legend>Tipo de conta</legend>

            <label className="radio-option">
              <input
                type="radio"
                name="account-type"
                value="paciente"
                defaultChecked
              />
              <span>Paciente</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="account-type"
                value="profissional"
              />
              <span>Profissional de saúde</span>
            </label>
          </fieldset>

          <div className="form-field">
            <label htmlFor="password">Senha</label>

            <input
              id="password"
              name="password"
              type="password"
              placeholder="Crie uma senha"
              autoComplete="new-password"
            />
          </div>

          <div className="form-field">
            <label htmlFor="confirm-password">Confirmar senha</label>

            <input
              id="confirm-password"
              name="confirm-password"
              type="password"
              placeholder="Digite a senha novamente"
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="primary-button">
            Criar conta
          </button>
        </form>

        <p className="auth-footer">
          Já tem uma conta?{' '}
          <button
            type="button"
            className="auth-link-button"
            onClick={onBack}
          >
            Entrar
          </button>
        </p>

        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar para o login
        </button>
      </div>
    </section>
  )
}

export default Cadastro