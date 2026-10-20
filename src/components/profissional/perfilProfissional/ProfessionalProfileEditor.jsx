import { useState } from 'react'
import ProfessionalProfileDialog from './ProfessionalProfileDialog.jsx'

function ProfessionalProfileEditor({ professional, onSave, onClose }) {
  // draft contém apenas os campos editáveis pelo backend
  const [draft, setDraft] = useState({
    name:     professional.name     || '',
    telefone: professional.telefone || '',
  })
  const [salvando, setSalvando] = useState(false)
  const [erroForm, setErroForm] = useState('')

  function updateField(event) {
    setDraft({ ...draft, [event.currentTarget.name]: event.currentTarget.value })
  }

  async function submit(event) {
    event.preventDefault()
    setSalvando(true)
    setErroForm('')
    try {
      await onSave(draft)
      // onSave fecha o diálogo em sucesso; não fechar aqui
    } catch (e) {
      setErroForm(e.message || 'Não foi possível salvar as alterações.')
    } finally {
      setSalvando(false)
    }
  }

  return (
    <ProfessionalProfileDialog title="Editar perfil" onClose={onClose}>
      <form className="professional-profile-form" onSubmit={submit}>
        <label className="professional-profile-form__field">
          Nome profissional
          <input
            name="name"
            value={draft.name}
            onChange={updateField}
            required
          />
        </label>
        <label className="professional-profile-form__field">
          Telefone
          <input
            name="telefone"
            type="tel"
            value={draft.telefone}
            onChange={updateField}
          />
        </label>
        {erroForm && (
          <p role="alert" style={{ color: 'var(--color-error, #dc2626)', fontSize: '0.875rem', margin: 0 }}>
            {erroForm}
          </p>
        )}
        <button
          className="professional-profile-form__submit"
          type="submit"
          disabled={salvando}
        >
          {salvando ? 'Salvando…' : 'Salvar alterações'}
        </button>
      </form>
    </ProfessionalProfileDialog>
  )
}

export default ProfessionalProfileEditor
