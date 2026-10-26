import './Auth.css'

// Tela informativa do "Esqueci minha senha".
// O app não envia e-mail (o Render Free bloqueia SMTP e o envio para terceiros
// exigiria domínio verificado). Quem redefine é a administração da clínica,
// gerando uma senha temporária. Aqui a pessoa descobre o que fazer.
function EsqueciSenha({ onBack }) {
  return (
    <section className="auth-page" aria-labelledby="esqueci-senha-title">
      <div className="auth-card">
        <p className="eyebrow">Desafila</p>

        <h1 id="esqueci-senha-title">Esqueceu sua senha?</h1>

        <p className="auth-description">
          Para sua segurança, a senha não é trocada por aqui. Quem redefine é a
          equipe da clínica.
        </p>

        <ol className="recovery-steps">
          <li>Procure a recepção da clínica e informe seu e-mail cadastrado.</li>
          <li>A equipe gera uma senha temporária para você na hora.</li>
          <li>Entre com essa senha e troque por uma nova em <strong>Perfil</strong>.</li>
        </ol>

        <p className="recovery-note">
          A senha temporária vale só para o primeiro acesso. Anote ou guarde em
          local seguro.
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

export default EsqueciSenha