import { useEffect, useState } from 'react'
import ProfessionalLayout from '../../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../../components/profissional/ProfessionalIcon.jsx'
import ProfessionalClinicsCard from '../../../components/profissional/perfilProfissional/ProfessionalClinicsCard.jsx'
import ProfessionalDataCard from '../../../components/profissional/perfilProfissional/ProfessionalDataCard.jsx'
import ProfessionalProfileEditor from '../../../components/profissional/perfilProfissional/ProfessionalProfileEditor.jsx'
import { api } from '../../../services/api.js'
import './PerfilProfissional.css'

// ─── helpers ─────────────────────────────────────────────────────────────────

// Calcula as iniciais de um nome completo (até 2 letras).
function calcularIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

// Monta a linha de credenciais: "CRM 142.889/PE" ou "CRM 142.889".
function montarRegistro(dados) {
  if (!dados.registro_conselho) return ''
  const uf = dados.uf_conselho ? `/${dados.uf_conselho}` : ''
  return `${dados.conselho || ''} ${dados.registro_conselho}${uf}`.trim()
}

// Converte a resposta bruta da API no shape da UI.
function mapearPerfil(dados, especialidadeNome) {
  return {
    name:         dados.nome,
    initials:     calcularIniciais(dados.nome),
    specialty:    especialidadeNome || 'Não informada',
    registration: montarRegistro(dados),
    email:        dados.email || '',
    telefone:     dados.telefone || '',
  }
}

// ─── componente principal ─────────────────────────────────────────────────────

function PerfilProfissional({ onLogout }) {
  const [profile, setProfile]       = useState(null)
  const [clinics, setClinics]       = useState([])
  // Guarda o nome da especialidade resolvido para reutilizar ao salvar.
  const [especialidadeNome, setEspecialidadeNome] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro]             = useState('')
  const [editando, setEditando]     = useState(false)

  // Carrega o perfil ao montar; resolve especialidade e clínica em best-effort.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await api('/profissionais/me')
        if (cancelado) return

        // Resolve nome da especialidade e da clínica em paralelo, sem bloquear
        // nem propagar erros para a tela principal.
        const [nomeEspecialidade, nomeClinica] = await Promise.all([
          dados.id_especialidade
            ? api(`/especialidades/${dados.id_especialidade}`)
                .then((r) => r?.nome || '')
                .catch(() => '')
            : Promise.resolve(''),
          dados.id_clinica
            ? api(`/clinicas/${dados.id_clinica}`)
                .then((r) => r?.nome || '')
                .catch(() => '')
            : Promise.resolve(''),
        ])

        if (cancelado) return

        setEspecialidadeNome(nomeEspecialidade)
        setProfile(mapearPerfil(dados, nomeEspecialidade))
        setClinics(
          nomeClinica
            ? [{ id: dados.id_clinica, name: nomeClinica }]
            : []
        )
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Não foi possível carregar o perfil.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => { cancelado = true }
  }, [])

  // Envia PUT /profissionais/me com apenas os campos permitidos.
  // Lança exceção em erro para o editor exibir; fecha o editor em sucesso.
  async function handleSave(draft) {
    const resposta = await api('/profissionais/me', {
      method: 'PUT',
      body: JSON.stringify({
        nome:     draft.name.trim(),
        telefone: draft.telefone.trim(),
      }),
    })
    // Atualiza o perfil a partir da resposta, preservando specialty/registration/email
    // já resolvidos (o PUT retorna apenas nome e telefone atualizados).
    setProfile((atual) => ({
      ...atual,
      name:     resposta.nome,
      initials: calcularIniciais(resposta.nome),
      telefone: resposta.telefone || '',
      specialty:    especialidadeNome || atual?.specialty || 'Não informada',
      registration: montarRegistro(resposta),
    }))
    setEditando(false)
  }

  function navigate(destination) {
    const routes = {
      inicio:    '#profissional',
      agenda:    '#agenda-profissional',
      historico: '#historico-profissional',
      perfil:    '#perfil-profissional',
    }
    window.location.hash = routes[destination]
  }

  // Valores do cabeçalho enquanto carrega ou em erro
  const nomeExibido     = profile?.name     || 'Profissional'
  const iniciaisExibidas = profile?.initials || '?'
  const especialidadeExibida = profile?.specialty || ''

  return (
    <ProfessionalLayout activePage="perfil" onNavigate={navigate} onLogout={onLogout}>
      <div className="professional-profile">
        <header className="professional-profile__header">
          <div className="professional-profile__title-row">
            <h1>Perfil profissional</h1>
            <button
              className="professional-profile__edit"
              type="button"
              // Só abre o editor depois que o perfil carregou
              onClick={() => { if (profile) setEditando(true) }}
              disabled={carregando || !!erro}
            >
              <ProfessionalIcon name="profileEdit" />
              <span>Editar</span>
            </button>
          </div>
          <div className="professional-profile__identity">
            <div className="professional-profile__avatar" aria-hidden="true">
              {iniciaisExibidas}
            </div>
            <div className="professional-profile__identity-copy">
              <h2>{nomeExibido}</h2>
              {especialidadeExibida && <p>{especialidadeExibida}</p>}
              <span>Perfil verificado</span>
            </div>
          </div>
        </header>

        <div className="professional-profile__main">

          {carregando && (
            <p className="professional-profile__empty" role="status" aria-live="polite">
              Carregando perfil…
            </p>
          )}

          {!carregando && erro && (
            <p className="professional-profile__empty" role="alert">
              {erro}
            </p>
          )}

          {!carregando && !erro && profile && (
            <>
              <ProfessionalDataCard professional={profile} />
              <ProfessionalClinicsCard clinics={clinics} />
            </>
          )}

        </div>
      </div>

      {editando && profile && (
        <ProfessionalProfileEditor
          professional={profile}
          onClose={() => setEditando(false)}
          onSave={handleSave}
        />
      )}
    </ProfessionalLayout>
  )
}

export default PerfilProfissional
