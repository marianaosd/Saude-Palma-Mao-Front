import { useState } from 'react'
import { api } from '../../services/api.js'

// Aba "Senhas" do administrador.
// O app não envia e-mail: o admin digita o e-mail do paciente ou do
// profissional, o back gera uma senha temporária e devolve uma única vez.
// Quem repassa a senha é a recepção da clínica.
function SenhasAdmin() {
  const [email, setEmail] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [resultado, setResultado] = useState(null)
  const [copiado, setCopiado] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setEnviando(true)
    setErro('')
    setResultado(null)
    setCopiado(false)

    try {
      const resposta = await api('/admin/senha-temporaria', {
        method: 'POST',
        perfil: 'admin',
        body: JSON.stringify({ email: email.trim() })
      })
      setResultado(resposta)
      setEmail('')
    } catch (error) {
      setErro(error.message || 'Não foi possível gerar a senha temporária.')
    } finally {
      setEnviando(false)
    }
  }

  async function copiarSenha() {
    try {
      await navigator.clipboard.writeText(resultado.senha_temporaria)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2500)
    } catch {
      setErro('Não foi possível copiar. Anote a senha antes de fechar.')
    }
  }

  return (
    <section className="admin-clinicas" aria-labelledby="admin-senhas-title">
      <header className="admin-section-header">
        <h1 id="admin-senhas-title" className="admin-section-title">Senhas de acesso</h1>
        <p className="admin-section-desc">
          Gere uma senha temporária para um paciente ou profissional que esqueceu
          a senha. A senha aparece uma única vez: repasse para a pessoa na hora.
        </p>
      </header>

      <form className="admin-form-card admin-senhas" onSubmit={handleSubmit}>
        <h2 className="admin-form-title">Redefinir senha de acesso</h2>

        <label className="admin-form-field">
          E-mail cadastrado
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.currentTarget.value)}
            placeholder="pessoa@email.com"
            autoComplete="off"
            required
          />
        </label>

        <button
          type="submit"
          className="admin-btn admin-btn--primary"
          disabled={enviando}
        >
          {enviando ? 'Gerando...' : 'Gerar senha temporária'}
        </button>
      </form>

      {erro && <p className="app-feedback error" role="alert">{erro}</p>}

      {resultado && (
        <div className="admin-senhas__result" role="status">
          <p className="admin-senhas__result-label">
            Senha temporária de {resultado.nome} ({resultado.perfil})
          </p>

          <p className="admin-senhas__senha">{resultado.senha_temporaria}</p>

          <div className="admin-senhas__actions">
            <button
              type="button"
              className="admin-btn"
              onClick={copiarSenha}
            >
              {copiado ? 'Copiado!' : 'Copiar senha'}
            </button>

            <button
              type="button"
              className="admin-btn"
              onClick={() => setResultado(null)}
            >
              Já repassei
            </button>
          </div>

          <p className="admin-senhas__warning">
            Anote agora: por segurança, esta senha não será exibida novamente.
            Oriente a pessoa a trocar a senha em <strong>Perfil</strong> no
            primeiro acesso.
          </p>
        </div>
      )}
    </section>
  )
}

export default SenhasAdmin