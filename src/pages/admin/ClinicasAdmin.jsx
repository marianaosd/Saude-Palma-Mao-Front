import { useState, useEffect } from 'react'
import { api } from '../../services/api.js'

function formatarCNPJ(cnpj) {
  const digitos = String(cnpj || '').replace(/\D/g, '')
  if (digitos.length !== 14) return cnpj || ''
  return digitos.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    '$1.$2.$3/$4-$5'
  )
}

const FORM_INICIAL = {
  nome: '',
  cnpj: '',
  endereco: '',
  telefone: '',
  email: '',
  horario_funcionamento: '',
  status: true
}

function ClinicasAdmin() {
  const [clinicas, setClinicas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')

  // Estado do formulário: null | 'novo' | { ...dadosClinica }
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState(FORM_INICIAL)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)

  // Exclusão com confirmação inline
  const [excluindoId, setExcluindoId] = useState(null)
  const [enviandoExclusao, setEnviandoExclusao] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados = await api('/clinicas', { perfil: 'admin' })
        if (ativo) {
          setClinicas(Array.isArray(dados) ? dados : [])
        }
      } catch (err) {
        if (ativo) {
          setErro(err.message || 'Erro ao carregar clínicas.')
        }
      } finally {
        if (ativo) {
          setCarregando(false)
        }
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  async function recarregarClinicas() {
    try {
      setErro('')
      const dados = await api('/clinicas', { perfil: 'admin' })
      setClinicas(Array.isArray(dados) ? dados : [])
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar lista de clínicas.')
    }
  }

  function handleAbrirNovo() {
    setFormData(FORM_INICIAL)
    setErroForm('')
    setEditando('novo')
  }

  function handleAbrirEditar(clinica) {
    setFormData({
      nome: clinica.nome || '',
      cnpj: clinica.cnpj || '',
      endereco: clinica.endereco || '',
      telefone: clinica.telefone || '',
      email: clinica.email || '',
      horario_funcionamento: clinica.horario_funcionamento || '',
      status: clinica.status !== false
    })
    setErroForm('')
    setEditando(clinica)
  }

  function handleFecharForm() {
    setEditando(null)
    setErroForm('')
    setFormData(FORM_INICIAL)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErroForm('')

    const nomeTrim = String(formData.nome || '').trim()
    const cnpjDigitos = String(formData.cnpj || '').replace(/\D/g, '')
    const enderecoTrim = String(formData.endereco || '').trim()

    if (!nomeTrim || !cnpjDigitos || !enderecoTrim) {
      setErroForm('Preencha os campos obrigatórios (Nome, CNPJ e Endereço).')
      return
    }

    if (cnpjDigitos.length !== 14) {
      setErroForm('O CNPJ deve conter exatamente 14 dígitos.')
      return
    }

    const payload = {
      nome: nomeTrim,
      cnpj: cnpjDigitos,
      endereco: enderecoTrim,
      telefone: String(formData.telefone || '').trim() || undefined,
      email: String(formData.email || '').trim() || undefined,
      horario_funcionamento: String(formData.horario_funcionamento || '').trim() || undefined,
      status: Boolean(formData.status)
    }

    try {
      setSalvando(true)
      if (editando === 'novo') {
        await api('/clinicas', {
          perfil: 'admin',
          method: 'POST',
          body: JSON.stringify(payload)
        })
      } else {
        await api(`/clinicas/${editando.id}`, {
          perfil: 'admin',
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      }

      handleFecharForm()
      await recarregarClinicas()
    } catch (err) {
      setErroForm(err.message || 'Erro ao salvar clínica.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarExclusao(id) {
    try {
      setEnviandoExclusao(true)
      setErroExclusao('')
      await api(`/clinicas/${id}`, {
        perfil: 'admin',
        method: 'DELETE'
      })
      setExcluindoId(null)
      await recarregarClinicas()
    } catch (err) {
      setErroExclusao(err.message || 'Erro ao excluir clínica.')
    } finally {
      setEnviandoExclusao(false)
    }
  }

  const clinicasFiltradas = clinicas.filter((clinica) => {
    if (!busca.trim()) return true
    const termo = busca.trim().toLowerCase()
    const nome = String(clinica.nome || '').toLowerCase()
    const endereco = String(clinica.endereco || '').toLowerCase()
    return nome.includes(termo) || endereco.includes(termo)
  })

  return (
    <div className="admin-clinicas">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Gerenciamento de Clínicas</h2>
          <p className="admin-section-desc">
            Cadastre, atualize e gerencie as clínicas parceiras da plataforma.
          </p>
        </div>
        {!editando && (
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAbrirNovo}
          >
            + Nova clínica
          </button>
        )}
      </div>

      {/* Formulário de criação/edição */}
      {editando && (
        <section
          className="admin-form-card"
          aria-labelledby="admin-form-clinica-title"
        >
          <h3 id="admin-form-clinica-title" className="admin-form-title">
            {editando === 'novo' ? 'Nova clínica' : 'Editar clínica'}
          </h3>

          <form onSubmit={handleSalvar} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-clinica-nome">Nome *</label>
                <input
                  id="form-clinica-nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome da clínica"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-clinica-cnpj">CNPJ (14 dígitos) *</label>
                <input
                  id="form-clinica-cnpj"
                  type="text"
                  required
                  value={formData.cnpj}
                  onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                  placeholder="00.000.000/0000-00"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-clinica-status">Status</label>
                <select
                  id="form-clinica-status"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                >
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
              </div>

              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-clinica-endereco">Endereço *</label>
                <input
                  id="form-clinica-endereco"
                  type="text"
                  required
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  placeholder="Rua, número, bairro, cidade - UF"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-clinica-telefone">Telefone</label>
                <input
                  id="form-clinica-telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(81) 3333-0000"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-clinica-email">E-mail</label>
                <input
                  id="form-clinica-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contato@clinica.com"
                />
              </div>

              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-clinica-horario">Horário de funcionamento</label>
                <input
                  id="form-clinica-horario"
                  type="text"
                  value={formData.horario_funcionamento}
                  onChange={(e) => setFormData({ ...formData, horario_funcionamento: e.target.value })}
                  placeholder="Ex.: Segunda a sexta, das 08h às 18h"
                />
              </div>
            </div>

            {erroForm && (
              <p className="app-feedback error" role="alert">
                {erroForm}
              </p>
            )}

            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={salvando}
              >
                {salvando ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                onClick={handleFecharForm}
                disabled={salvando}
              >
                Cancelar
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Busca */}
      <div className="admin-search-wrapper">
        <label htmlFor="busca-clinica" className="admin-search-label">
          Buscar clínica
        </label>
        <input
          id="busca-clinica"
          type="search"
          className="admin-search-input"
          placeholder="Buscar por nome ou endereço..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {/* Estados de carregamento, erro global e erro de exclusão */}
      {carregando && (
        <p className="admin-loading" role="status">
          Carregando clínicas...
        </p>
      )}

      {erro && (
        <p className="app-feedback error" role="alert">
          {erro}
        </p>
      )}

      {erroExclusao && (
        <p className="app-feedback error" role="alert">
          {erroExclusao}
        </p>
      )}

      {/* Lista de clínicas */}
      {!carregando && !erro && clinicas.length === 0 && (
        <p className="admin-empty-state">Nenhuma clínica cadastrada.</p>
      )}

      {!carregando && !erro && clinicas.length > 0 && clinicasFiltradas.length === 0 && (
        <p className="admin-empty-state">
          Nenhuma clínica encontrada para a busca informada.
        </p>
      )}

      {!carregando && !erro && clinicasFiltradas.length > 0 && (
        <ul className="admin-list" aria-label="Lista de clínicas">
          {clinicasFiltradas.map((clinica) => {
            const estaExcluindo = excluindoId === clinica.id

            return (
              <li key={clinica.id} className="admin-card">
                <div className="admin-card__header">
                  <div className="admin-card__title-group">
                    <h3 className="admin-card__title">{clinica.nome}</h3>
                    <span
                      className={`admin-badge ${
                        clinica.status !== false
                          ? 'admin-badge--active'
                          : 'admin-badge--inactive'
                      }`}
                    >
                      {clinica.status !== false ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  {!estaExcluindo && (
                    <div className="admin-card__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => handleAbrirEditar(clinica)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger-outline"
                        onClick={() => {
                          setExcluindoId(clinica.id)
                          setErroExclusao('')
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                <div className="admin-card__body">
                  <p className="admin-card__info">
                    <strong>Endereço:</strong> {clinica.endereco}
                  </p>
                  <p className="admin-card__info">
                    <strong>CNPJ:</strong> {formatarCNPJ(clinica.cnpj)}
                  </p>
                  {clinica.telefone && (
                    <p className="admin-card__info">
                      <strong>Telefone:</strong> {clinica.telefone}
                    </p>
                  )}
                  {clinica.email && (
                    <p className="admin-card__info">
                      <strong>E-mail:</strong> {clinica.email}
                    </p>
                  )}
                  {clinica.horario_funcionamento && (
                    <p className="admin-card__info">
                      <strong>Horário:</strong> {clinica.horario_funcionamento}
                    </p>
                  )}
                </div>

                {estaExcluindo && (
                  <div
                    className="admin-confirm-inline"
                    role="region"
                    aria-label={`Confirmação de exclusão da clínica ${clinica.nome}`}
                  >
                    <p className="admin-confirm-text">Excluir esta clínica?</p>
                    <div className="admin-confirm-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        disabled={enviandoExclusao}
                        onClick={() => handleConfirmarExclusao(clinica.id)}
                      >
                        {enviandoExclusao ? 'Excluindo...' : 'Confirmar exclusão'}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        disabled={enviandoExclusao}
                        onClick={() => {
                          setExcluindoId(null)
                          setErroExclusao('')
                        }}
                      >
                        Manter
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ClinicasAdmin
