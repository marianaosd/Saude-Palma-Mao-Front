import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import './Paciente.css'

function formatarDataNascimento(valor) {
  const iso = String(valor || '').slice(0, 10)
  const [ano, mes, dia] = iso.split('-')
  if (!ano || !mes || !dia) return 'Não informada'
  return `${dia}/${mes}/${ano}`
}

function formatarCpf(valor) {
  const digitos = String(valor || '').replace(/\D/g, '')
  if (digitos.length !== 11) return valor || 'Não informado'
  return `${digitos.slice(0, 3)}.${digitos.slice(3, 6)}.${digitos.slice(6, 9)}-${digitos.slice(9)}`
}

// Aba Perfil: os dados cadastrais e a edição dos campos que a API aceita
// (nome, data de nascimento e telefone). E-mail e CPF são somente leitura.
function PerfilPaciente() {
  const [dadosPaciente, setDadosPaciente] = useState(null)
  const [carregandoDados, setCarregandoDados] = useState(true)
  const [erroDados, setErroDados] = useState('')
  const [avisoDados, setAvisoDados] = useState('')
  const [editandoDados, setEditandoDados] = useState(false)
  const [salvandoDados, setSalvandoDados] = useState(false)
  const [rascunhoDados, setRascunhoDados] = useState({ nome_completo: '', data_nascimento: '', telefone: '' })

  useEffect(() => {
    let ativo = true

    async function carregarDados() {
      try {
        const dados = await api('/pacientes/me')
        if (ativo) setDadosPaciente(dados)
      } catch (error) {
        if (ativo) setErroDados(error.message || 'Não foi possível carregar seus dados.')
      } finally {
        if (ativo) setCarregandoDados(false)
      }
    }

    carregarDados()
    return () => { ativo = false }
  }, [])

  function handleCampoDados(event) {
    const { name, value } = event.currentTarget
    setRascunhoDados((atual) => ({ ...atual, [name]: value }))
  }

  async function handleSalvarDados(event) {
    event.preventDefault()
    setSalvandoDados(true)
    setErroDados('')
    setAvisoDados('')

    try {
      const atualizado = await api('/pacientes/me', {
        method: 'PUT',
        body: JSON.stringify({
          nome_completo: rascunhoDados.nome_completo.trim(),
          data_nascimento: rascunhoDados.data_nascimento,
          telefone: rascunhoDados.telefone.trim()
        })
      })
      setDadosPaciente(atualizado)
      setEditandoDados(false)
      setAvisoDados('Dados atualizados com sucesso.')
    } catch (error) {
      setErroDados(error.message || 'Não foi possível salvar seus dados.')
    } finally {
      setSalvandoDados(false)
    }
  }

  return (
    <section className="patient-page" aria-labelledby="patient-profile-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-profile-title">Meu perfil</h1>

          <p>
            Confira e atualize seus dados cadastrais.
          </p>
        </div>
      </div>

      <section className="patient-data-card" aria-labelledby="patient-data-title">
        <div className="patient-data-header">
          <div>
            <p className="eyebrow">Meus dados</p>
            <h2 id="patient-data-title">Seus dados cadastrais</h2>
          </div>

          {!carregandoDados && dadosPaciente && !editandoDados && (
            <button
              type="button"
              className="patient-data-button"
              onClick={() => {
                setRascunhoDados({
                  nome_completo: dadosPaciente.nome_completo || '',
                  data_nascimento: String(dadosPaciente.data_nascimento || '').slice(0, 10),
                  telefone: dadosPaciente.telefone || ''
                })
                setErroDados('')
                setAvisoDados('')
                setEditandoDados(true)
              }}
            >
              Editar meus dados
            </button>
          )}
        </div>

        {avisoDados && (
          <p className="patient-data-success" role="status">{avisoDados}</p>
        )}

        {erroDados && (
          <p className="patient-data-error" role="alert">{erroDados}</p>
        )}

        {carregandoDados && <p>Carregando seus dados…</p>}

        {!carregandoDados && dadosPaciente && !editandoDados && (
          <>
            <dl className="patient-data-list">
              <div className="patient-data-row">
                <dt>Nome completo</dt>
                <dd>{dadosPaciente.nome_completo || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>Data de nascimento</dt>
                <dd>{formatarDataNascimento(dadosPaciente.data_nascimento)}</dd>
              </div>
              <div className="patient-data-row">
                <dt>Telefone</dt>
                <dd>{dadosPaciente.telefone || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>E-mail</dt>
                <dd>{dadosPaciente.email || 'Não informado'}</dd>
              </div>
              <div className="patient-data-row">
                <dt>CPF</dt>
                <dd>{formatarCpf(dadosPaciente.cpf)}</dd>
              </div>
            </dl>
            <p className="patient-data-note">
              Para alterar e-mail ou CPF, procure a recepção da clínica.
            </p>
          </>
        )}

        {!carregandoDados && dadosPaciente && editandoDados && (
          <form className="patient-data-form" onSubmit={handleSalvarDados}>
            <label className="patient-data-field">
              Nome completo
              <input
                name="nome_completo"
                value={rascunhoDados.nome_completo}
                onChange={handleCampoDados}
                required
              />
            </label>

            <label className="patient-data-field">
              Data de nascimento
              <input
                name="data_nascimento"
                type="date"
                value={rascunhoDados.data_nascimento}
                onChange={handleCampoDados}
                required
              />
            </label>

            <label className="patient-data-field">
              Telefone
              <input
                name="telefone"
                type="tel"
                value={rascunhoDados.telefone}
                onChange={handleCampoDados}
              />
            </label>

            <div className="patient-data-actions">
              <button
                type="submit"
                className="patient-data-button patient-data-button--primary"
                disabled={salvandoDados}
              >
                {salvandoDados ? 'Salvando…' : 'Salvar alterações'}
              </button>
              <button
                type="button"
                className="patient-data-button"
                disabled={salvandoDados}
                onClick={() => {
                  setEditandoDados(false)
                  setErroDados('')
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </section>
    </section>
  )
}

export default PerfilPaciente
