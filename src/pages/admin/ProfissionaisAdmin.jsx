import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'

const FORM_INICIAL = {
  nome: '',
  cpf: '',
  email: '',
  senha: '',
  conselho: '',
  registro_conselho: '',
  uf_conselho: '',
  telefone: '',
  id_clinica: '',
  id_especialidade: '',
  status: true
}

function ProfissionaisAdmin() {
  const [profissionais, setProfissionais] = useState([])
  const [clinicas, setClinicas] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [busca, setBusca] = useState('')
  const [editando, setEditando] = useState(null)
  const [formData, setFormData] = useState(FORM_INICIAL)
  const [erroForm, setErroForm] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [confirmandoInativacaoId, setConfirmandoInativacaoId] = useState(null)
  const [alterandoStatusId, setAlterandoStatusId] = useState(null)
  const [erroStatusId, setErroStatusId] = useState(null)
  const [erroStatus, setErroStatus] = useState('')

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [dadosProfissionais, dadosClinicas, dadosEspecialidades] = await Promise.all([
          api('/profissionais', { perfil: 'admin' }),
          api('/clinicas', { perfil: 'admin' }),
          api('/especialidades', { perfil: 'admin' })
        ])

        if (ativo) {
          setProfissionais(Array.isArray(dadosProfissionais) ? dadosProfissionais : [])
          setClinicas(Array.isArray(dadosClinicas) ? dadosClinicas : [])
          setEspecialidades(Array.isArray(dadosEspecialidades) ? dadosEspecialidades : [])
        }
      } catch (err) {
        if (ativo) {
          setErro(err.message || 'Erro ao carregar profissionais.')
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

  async function recarregarDados() {
    try {
      setErro('')
      const [dadosProfissionais, dadosClinicas, dadosEspecialidades] = await Promise.all([
        api('/profissionais', { perfil: 'admin' }),
        api('/clinicas', { perfil: 'admin' }),
        api('/especialidades', { perfil: 'admin' })
      ])
      setProfissionais(Array.isArray(dadosProfissionais) ? dadosProfissionais : [])
      setClinicas(Array.isArray(dadosClinicas) ? dadosClinicas : [])
      setEspecialidades(Array.isArray(dadosEspecialidades) ? dadosEspecialidades : [])
    } catch (err) {
      setErro(err.message || 'Erro ao atualizar as listas administrativas.')
    }
  }

  function handleAbrirNovo() {
    setFormData(FORM_INICIAL)
    setErroForm('')
    setEditando('novo')
  }

  function handleAbrirEditar(profissional) {
    setFormData({
      nome: profissional.nome || '',
      cpf: '',
      email: profissional.email || '',
      senha: '',
      conselho: profissional.conselho || '',
      registro_conselho: profissional.registro_conselho || '',
      uf_conselho: profissional.uf_conselho || '',
      telefone: profissional.telefone || '',
      id_clinica: profissional.id_clinica == null ? '' : String(profissional.id_clinica),
      id_especialidade: profissional.id_especialidade == null
        ? ''
        : String(profissional.id_especialidade),
      status: profissional.status !== false
    })
    setErroForm('')
    setEditando(profissional)
  }

  function handleFecharForm() {
    setEditando(null)
    setErroForm('')
    setFormData(FORM_INICIAL)
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErroForm('')

    const criando = editando === 'novo'
    const nome = String(formData.nome || '').trim()
    const cpf = String(formData.cpf || '').replace(/\D/g, '')
    const email = String(formData.email || '').trim()
    const senha = String(formData.senha || '')
    const conselho = String(formData.conselho || '').trim()
    const registroConselho = String(formData.registro_conselho || '').trim()
    const clinicaSelecionada = clinicas.find(
      (clinica) => String(clinica.id) === formData.id_clinica
    )
    const especialidadeSelecionada = especialidades.find(
      (especialidade) => String(especialidade.id) === formData.id_especialidade
    )

    if (
      !nome ||
      !email ||
      !conselho ||
      !registroConselho ||
      !clinicaSelecionada ||
      !especialidadeSelecionada
    ) {
      setErroForm('Preencha todos os campos obrigatórios.')
      return
    }

    if (criando && cpf.length !== 11) {
      setErroForm('O CPF deve conter exatamente 11 dígitos.')
      return
    }

    if (criando && senha.length < 8) {
      setErroForm('A senha inicial deve conter pelo menos 8 caracteres.')
      return
    }

    const payload = {
      id_clinica: clinicaSelecionada.id,
      id_especialidade: especialidadeSelecionada.id,
      nome,
      registro_conselho: registroConselho,
      conselho,
      uf_conselho: String(formData.uf_conselho || '').trim() || undefined,
      telefone: String(formData.telefone || '').trim() || undefined,
      email,
      status: Boolean(formData.status)
    }

    if (criando) {
      payload.cpf = cpf
      payload.senha = senha
    }

    try {
      setSalvando(true)
      if (criando) {
        await api('/profissionais', {
          perfil: 'admin',
          method: 'POST',
          body: JSON.stringify(payload)
        })
      } else {
        await api(`/profissionais/${editando.id}`, {
          perfil: 'admin',
          method: 'PUT',
          body: JSON.stringify(payload)
        })
      }

      handleFecharForm()
      await recarregarDados()
    } catch (err) {
      setErroForm(err.message || 'Erro ao salvar profissional.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleConfirmarInativacao(id) {
    try {
      setAlterandoStatusId(id)
      setErroStatusId(null)
      setErroStatus('')
      await api(`/profissionais/${id}`, {
        perfil: 'admin',
        method: 'DELETE'
      })
      setConfirmandoInativacaoId(null)
      await recarregarDados()
    } catch (err) {
      setErroStatusId(id)
      setErroStatus(err.message || 'Erro ao inativar profissional.')
    } finally {
      setAlterandoStatusId(null)
    }
  }

  async function handleReativar(id) {
    try {
      setAlterandoStatusId(id)
      setErroStatusId(null)
      setErroStatus('')
      await api(`/profissionais/${id}`, {
        perfil: 'admin',
        method: 'PUT',
        body: JSON.stringify({ status: true })
      })
      await recarregarDados()
    } catch (err) {
      setErroStatusId(id)
      setErroStatus(err.message || 'Erro ao reativar profissional.')
    } finally {
      setAlterandoStatusId(null)
    }
  }

  const profissionaisFiltrados = profissionais.filter((profissional) => {
    if (!busca.trim()) return true
    const termo = busca.trim().toLowerCase()
    const clinica = clinicas.find(
      (item) => String(item.id) === String(profissional.id_clinica)
    )
    const especialidade = especialidades.find(
      (item) => String(item.id) === String(profissional.id_especialidade)
    )
    const nomeProfissional = String(profissional.nome || '').toLowerCase()
    const nomeClinica = String(clinica?.nome || '').toLowerCase()
    const nomeEspecialidade = String(especialidade?.nome || '').toLowerCase()
    return nomeProfissional.includes(termo) ||
      nomeClinica.includes(termo) ||
      nomeEspecialidade.includes(termo)
  })

  return (
    <div className="admin-clinicas">
      <div className="admin-section-header">
        <div>
          <h2 className="admin-section-title">Gerenciamento de Profissionais</h2>
          <p className="admin-section-desc">
            Cadastre, atualize e gerencie os profissionais da plataforma.
          </p>
        </div>
        {!editando && (
          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleAbrirNovo}
          >
            + Novo profissional
          </button>
        )}
      </div>

      {editando && (
        <section
          className="admin-form-card"
          aria-labelledby="admin-form-profissional-title"
        >
          <h3 id="admin-form-profissional-title" className="admin-form-title">
            {editando === 'novo' ? 'Novo profissional' : 'Editar profissional'}
          </h3>
          {editando !== 'novo' && (
            <p className="admin-card__info">
              CPF e senha não podem ser alterados por aqui.
            </p>
          )}

          <form onSubmit={handleSalvar} className="admin-form">
            <div className="admin-form-grid">
              <div className="admin-form-field admin-form-field--full">
                <label htmlFor="form-profissional-nome">Nome *</label>
                <input
                  id="form-profissional-nome"
                  type="text"
                  required
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  placeholder="Nome completo"
                />
              </div>

              {editando === 'novo' && (
                <div className="admin-form-field">
                  <label htmlFor="form-profissional-cpf">CPF *</label>
                  <input
                    id="form-profissional-cpf"
                    type="text"
                    inputMode="numeric"
                    required
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    placeholder="000.000.000-00"
                  />
                </div>
              )}

              <div className="admin-form-field">
                <label htmlFor="form-profissional-email">E-mail *</label>
                <input
                  id="form-profissional-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="profissional@email.com"
                />
              </div>

              {editando === 'novo' && (
                <div className="admin-form-field">
                  <label htmlFor="form-profissional-senha">Senha inicial *</label>
                  <input
                    id="form-profissional-senha"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="Mínimo de 8 caracteres"
                  />
                </div>
              )}

              <div className="admin-form-field">
                <label htmlFor="form-profissional-conselho">Conselho *</label>
                <input
                  id="form-profissional-conselho"
                  type="text"
                  required
                  value={formData.conselho}
                  onChange={(e) => setFormData({ ...formData, conselho: e.target.value })}
                  placeholder="CRM"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-registro">Registro no conselho *</label>
                <input
                  id="form-profissional-registro"
                  type="text"
                  required
                  value={formData.registro_conselho}
                  onChange={(e) => setFormData({ ...formData, registro_conselho: e.target.value })}
                  placeholder="Número do registro"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-uf">UF do conselho</label>
                <input
                  id="form-profissional-uf"
                  type="text"
                  value={formData.uf_conselho}
                  onChange={(e) => setFormData({ ...formData, uf_conselho: e.target.value })}
                  placeholder="PE"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-telefone">Telefone</label>
                <input
                  id="form-profissional-telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  placeholder="(81) 99999-0000"
                />
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-clinica">Clínica *</label>
                <select
                  id="form-profissional-clinica"
                  required
                  value={formData.id_clinica}
                  onChange={(e) => setFormData({ ...formData, id_clinica: e.target.value })}
                >
                  <option value="">Selecione uma clínica</option>
                  {clinicas.map((clinica) => (
                    <option key={clinica.id} value={String(clinica.id)}>
                      {clinica.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-especialidade">Especialidade *</label>
                <select
                  id="form-profissional-especialidade"
                  required
                  value={formData.id_especialidade}
                  onChange={(e) => setFormData({ ...formData, id_especialidade: e.target.value })}
                >
                  <option value="">Selecione uma especialidade</option>
                  {especialidades.map((especialidade) => (
                    <option key={especialidade.id} value={String(especialidade.id)}>
                      {especialidade.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="admin-form-field">
                <label htmlFor="form-profissional-status">Status</label>
                <select
                  id="form-profissional-status"
                  value={formData.status ? 'true' : 'false'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value === 'true' })}
                >
                  <option value="true">Ativo</option>
                  <option value="false">Inativo</option>
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
        <label htmlFor="busca-profissional" className="admin-search-label">
          Buscar profissional
        </label>
        <input
          id="busca-profissional"
          type="search"
          className="admin-search-input"
          placeholder="Buscar por profissional, clínica ou especialidade..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {carregando && (
        <p className="admin-loading" role="status">
          Carregando profissionais...
        </p>
      )}

      {erro && (
        <p className="app-feedback error" role="alert">
          {erro}
        </p>
      )}

      {!carregando && !erro && profissionais.length === 0 && (
        <p className="admin-empty-state">Nenhum profissional cadastrado.</p>
      )}

      {!carregando && !erro && profissionais.length > 0 && profissionaisFiltrados.length === 0 && (
        <p className="admin-empty-state">
          Nenhum profissional encontrado para a busca informada.
        </p>
      )}

      {!carregando && !erro && profissionaisFiltrados.length > 0 && (
        <ul className="admin-list" aria-label="Lista de profissionais">
          {profissionaisFiltrados.map((profissional) => {
            const clinica = clinicas.find(
              (item) => String(item.id) === String(profissional.id_clinica)
            )
            const especialidade = especialidades.find(
              (item) => String(item.id) === String(profissional.id_especialidade)
            )
            const estaAtivo = profissional.status !== false
            const estaConfirmandoInativacao = confirmandoInativacaoId === profissional.id
            const estaAlterandoStatus = alterandoStatusId === profissional.id
            const conselhoCompleto = [
              profissional.conselho,
              profissional.uf_conselho,
              profissional.registro_conselho
            ].filter(Boolean).join(' ')

            return (
              <li key={profissional.id} className="admin-card">
                <div className="admin-card__header">
                  <div className="admin-card__title-group">
                    <h3 className="admin-card__title">{profissional.nome}</h3>
                    <span
                      className={`admin-badge ${
                        estaAtivo ? 'admin-badge--active' : 'admin-badge--inactive'
                      }`}
                    >
                      {estaAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  {!estaConfirmandoInativacao && (
                    <div className="admin-card__actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        onClick={() => handleAbrirEditar(profissional)}
                      >
                        Editar
                      </button>
                      {estaAtivo ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn--danger-outline"
                          disabled={estaAlterandoStatus}
                          onClick={() => {
                            setConfirmandoInativacaoId(profissional.id)
                            setErroStatusId(null)
                            setErroStatus('')
                          }}
                        >
                          Inativar
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="admin-btn admin-btn--primary"
                          disabled={estaAlterandoStatus}
                          onClick={() => handleReativar(profissional.id)}
                        >
                          {estaAlterandoStatus ? 'Reativando...' : 'Reativar'}
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className="admin-card__body">
                  <p className="admin-card__info">
                    <strong>Conselho:</strong> {conselhoCompleto || '—'}
                  </p>
                  <p className="admin-card__info">
                    <strong>Clínica:</strong> {clinica?.nome || '—'}
                  </p>
                  <p className="admin-card__info">
                    <strong>Especialidade:</strong> {especialidade?.nome || '—'}
                  </p>
                  <p className="admin-card__info">
                    <strong>E-mail:</strong> {profissional.email || '—'}
                  </p>
                </div>

                {estaConfirmandoInativacao && (
                  <div
                    className="admin-confirm-inline"
                    role="region"
                    aria-label={`Confirmação de inativação do profissional ${profissional.nome}`}
                  >
                    <p className="admin-confirm-text">
                      Inativar este profissional? Ele deixará de aparecer para novos agendamentos, mas o histórico será preservado.
                    </p>
                    <div className="admin-confirm-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn--danger"
                        disabled={estaAlterandoStatus}
                        onClick={() => handleConfirmarInativacao(profissional.id)}
                      >
                        {estaAlterandoStatus ? 'Inativando...' : 'Confirmar inativação'}
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn--secondary"
                        disabled={estaAlterandoStatus}
                        onClick={() => {
                          setConfirmandoInativacaoId(null)
                          setErroStatusId(null)
                          setErroStatus('')
                        }}
                      >
                        Manter
                      </button>
                    </div>
                    {erroStatusId === profissional.id && erroStatus && (
                      <p className="app-feedback error" role="alert">
                        {erroStatus}
                      </p>
                    )}
                  </div>
                )}

                {!estaConfirmandoInativacao && erroStatusId === profissional.id && erroStatus && (
                  <p className="app-feedback error" role="alert">
                    {erroStatus}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default ProfissionaisAdmin