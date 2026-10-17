import { useState } from 'react'
import { api, salvarSessao } from '../../services/api.js'
import './Auth.css'

function Cadastro({ onBack, onCadastro, onLoginProfissional }) {
  const [tipoConta, setTipoConta] = useState('paciente')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    if (tipoConta === 'profissional') {
      onLoginProfissional()
      return
    }

    const form = new FormData(event.currentTarget)
    const senha = String(form.get('password') || '')
    const confirmacao = String(form.get('confirm-password') || '')

    if (senha !== confirmacao) {
      setErro('As senhas não coincidem.')
      return
    }

    setEnviando(true)

    try {
      const resposta = await api('/auth/cadastro', {
        method: 'POST',
        body: JSON.stringify({
          nome_completo: String(form.get('name') || '').trim(),
          cpf: String(form.get('cpf') || '').trim(),
          data_nascimento: String(form.get('birthdate') || ''),
          telefone: String(form.get('phone') || '').trim() || null,
          email: String(form.get('email') || '').trim(),
          senha,
          contato_emergencia_nome: String(form.get('emergency-name') || '').trim() || null,
          contato_emergencia_telefone: String(form.get('emergency-phone') || '').trim() || null,
          relacao_contato: String(form.get('emergency-relation') || '').trim() || null
        })
      })

      salvarSessao(resposta.token, resposta.paciente)
      onCadastro(resposta.paciente)
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section className="auth-page" aria-labelledby="cadastro-title">
      <div className="auth-card">
        <p className="eyebrow">Saúde na Palma da Mão</p>

        <h1 id="cadastro-title">Crie sua conta</h1>

        <p className="auth-description">
          Cadastre-se para começar sua jornada de atendimento.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <fieldset className="form-field account-type">
            <legend>Tipo de conta</legend>

            <label className="radio-option">
              <input
                type="radio"
                name="account-type"
                value="paciente"
                checked={tipoConta === 'paciente'}
                onChange={() => setTipoConta('paciente')}
              />
              <span>Paciente</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="account-type"
                value="profissional"
                checked={tipoConta === 'profissional'}
                onChange={() => setTipoConta('profissional')}
              />
              <span>Profissional de saúde</span>
            </label>
          </fieldset>

          {tipoConta === 'profissional' ? (
            <p className="app-feedback success">
              O acesso de profissionais é feito por credenciais fornecidas pela clínica.
              Clique em continuar para ir à tela de login profissional.
            </p>
          ) : (
            <>
              <div className="form-field">
                <label htmlFor="name">Nome completo</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Digite seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="cpf">CPF</label>
                <input
                  id="cpf"
                  name="cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  autoComplete="off"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="birthdate">Data de nascimento</label>
                <input
                  id="birthdate"
                  name="birthdate"
                  type="date"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="phone">Telefone</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="(81) 90000-0000"
                  autoComplete="tel"
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
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="password">Senha</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Crie uma senha"
                  autoComplete="new-password"
                  minLength={8}
                  required
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
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="emergency-name">Contato de emergência (opcional)</label>
                <input
                  id="emergency-name"
                  name="emergency-name"
                  type="text"
                  placeholder="Nome do contato"
                />
              </div>

              <div className="form-field">
                <label htmlFor="emergency-phone">Telefone do contato</label>
                <input
                  id="emergency-phone"
                  name="emergency-phone"
                  type="tel"
                  placeholder="(81) 90000-0000"
                />
              </div>

              <div className="form-field">
                <label htmlFor="emergency-relation">Relação</label>
                <input
                  id="emergency-relation"
                  name="emergency-relation"
                  type="text"
                  placeholder="Mãe, pai, cônjuge..."
                />
              </div>
            </>
          )}

          {erro && <p className="app-feedback error" role="alert">{erro}</p>}

          <button type="submit" className="primary-button" disabled={enviando}>
            {enviando ? 'Criando conta...' : 'Criar conta'}
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
