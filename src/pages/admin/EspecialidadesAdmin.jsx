import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'

const FORM_INICIAL = {
  nome: '',
  descricao: '',
  status: true
}

function EspecialidadesAdmin() {
  const [especialidades, setEspecialidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState(FORM_INICIAL)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [excluindoId, setExcluindoId] = useState(null)
  const [enviandoExclusao, setEnviandoExclusao] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados = await api('/especialidades', { perfil: 'admin' })
        if (ativo) {
          setEspecialidades(Array.isArray(dados) ? dados : [])
        }
      } catch (err) {
        if (ativo) {
          setErro(err.message || 'Erro ao carregar especialidades.')
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

  async function recarregarEspecialidades() {
    try {
      setErro('')
      const dados = await api('/especialidades', { perfil: 'admin' })
      setEspecialidades(Array.isArray(dados) ? dados : [])
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar lista de especialidades.')
    }
  }

  function handleAbrirNovo() {
    setFormData(FORM_INICIAL)
    setErroForm('')
    setEditando('novo')
  }

  function handleAbrirEditar(especialidade) {
    setFormData({
      nome: especialidade.nome || '',
      descricao: especialidade.descricao || '',
      status: especialidade.status !== false
    })
    setErroForm('')
    setEditando(especialidade)
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
    if (!nomeTrim) {
      setErroForm('Preencha o campo obrigatório Nome.')
      return
    }

    const payload = {
      nome: nomeTrim,
      descricao: String(formData.descricao || '').trim() || undefined,
      status: Boolean(formData.status)
    }

    try {
      setSalvando(true)
      if (editando === 'novo') {
        await api('/especialidades', {
          perfil: 'admin',
          method: 'POST',
          body: JSON.stringify(payload)
        })
      } else {
        await api(`/especialidades/${editando.id}`, {
          perfil: 'admin',
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      }

      handleFecharForm()
      await recarregarEspecialidades()
    } catch (err) {
      setErroForm(err.message || 'Erro ao salvar especialidade.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarExclusao(id) {
    try {
      setEnviandoExclusao(true)
      setErroExclusao('')
      await api(`/especialidades/${id}`, {
        perfil: 'admin',
        method: 'DELETE'
      })
      setExcluindoId(null)
      await recarregarEspecialidades()
    } catch (err) {
      setErroExclusao(err.message || 'Erro ao excluir especialidade.')
    } finally {
      setEnviandoExclusao(false)
    }
  }

  const especialidadesFiltradas = especialidades.filter((especialidade) => {
    if (!busca.trim()) return true
    const termo = busca.trim().toLowerCase()
    const nome = String(especialidade.nome || '').toLowerCase()
    return nome.includes(termo)
  })

  return (
    <div className="admin-clinicas">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Gerenciamento de Especialidades</h2>
          <p className="admin-section-desc">
            Cadastre, atualize e gerencie as especialidades da plataforma.
          </p>
        </div>
        {!editando && (
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAbrirNovo}
          >
            + Nova especialidade
          </button>
        )}
      </div>

      {editando && (
        <section
          className="admin-form-card"
          aria-labelledby="admin-form-especialidade-title"
        >
          <h3 id="admin-form-especialidade-title" className="admin-form-title">
            {editando === 'novo' ? 'Nova especialidade' : 'Editar especialidade'}
          </h3>

          <form onSubmit={handleSalvar} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-especialidade-nome">Nome *</label>
                <input
                  id="form-especialidade-nome"
                  type="text"
                  required
                  maxLength={100}
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome da especialidade"
                />
              </div>

              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-especialidade-descricao">Descrição</label>
                <textarea
                  id="form-especialidade-descricao"
                  rows={4}
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição da especialidade"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-especialidade-status">Status</label>
                <select
                  id="form-especialidade-status"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                >
                  <option value="true">Ativa</option>
                  <option value="false">Inativa</option>
                </select>
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

      <div className="admin-search-wrapper">
        <label htmlFor="busca-especialidade" className="admin-search-label">
          Buscar especialidade
        </label>
        <input
          id="busca-especialidade"
          type="search"
          className="admin-search-input"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && (
        <p className="admin-loading" role="status">
          Carregando especialidades...
        </p>
      )}

      {erro && (
        <p className="app-feedback error" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && especialidades.length === 0 && (
        <p className="admin-empty-state">Nenhuma especialidade cadastrada.</p>
      )}

      {!carregando && !erro && especialidades.length > 0 && especialidadesFiltradas.length === 0 && (
        <p className="admin-empty-state">
          Nenhuma especialidade encontrada para a busca informada.
        </p>
      )}

      {!carregando && !erro && especialidadesFiltradas.length > 0 && (
        <ul className="admin-list" aria-label="Lista de especialidades">
          {especialidadesFiltradas.map((especialidade) => {
            const estaExcluindo = excluindoId === especialidade.id

            return (
              <li key={especialidade.id} className="admin-card">
                <div className="admin-card__header">
                  <div className="admin-card__title-group">
                    <h3 className="admin-card__title">{especialidade.nome}</h3>
                    <span
                      className={`admin-badge ${
                        especialidade.status !== false
                          ? 'admin-badge--active'
                          : 'admin-badge--inactive'
                      }`}
                    >
                      {especialidade.status !== false ? 'Ativa' : 'Inativa'}
                    </span>
                  </div>

                  {!estaExcluindo && (
                    <div className="admin-card__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => handleAbrirEditar(especialidade)}
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger-outline"
                        onClick={() => {
                          setExcluindoId(especialidade.id)
                          setErroExclusao('')
                        }}
                      >
                        Excluir
                      </button>
                    </div>
                  )}
                </div>

                {especialidade.descricao && (
                  <div className="admin-card__body">
                    <p className="admin-card__info">{especialidade.descricao}</p>
                  </div>
                )}

                {estaExcluindo && (
                  <div
                    className="admin-confirm-inline"
                    role="region"
                    aria-label={`Confirmação de exclusão da especialidade ${especialidade.nome}`}
                  >
                    <p className="admin-confirm-text">Excluir esta especialidade?</p>
                    <div className="admin-confirm-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        disabled={enviandoExclusao}
                        onClick={() => handleConfirmarExclusao(especialidade.id)}
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
                    {erroExclusao && (
                      <p className="app-feedback error" role="alert">
                        {erroExclusao}
                      </p>
                    )}
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

export default EspecialidadesAdmin