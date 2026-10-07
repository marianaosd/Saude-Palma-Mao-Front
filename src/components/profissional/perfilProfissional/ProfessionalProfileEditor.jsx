import { useState } from 'react'
import ProfessionalProfileDialog from './ProfessionalProfileDialog.jsx'

function ProfessionalProfileEditor({ professional, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...professional })

  function updateField(event) {
    setDraft({ ...draft, [event.currentTarget.name]: event.currentTarget.value })
  }

  function submit(event) {
    event.preventDefault()
    const initials = draft.name
      .replace(/^Dr\.\s*/i, '')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
    onSave({ ...draft, initials })
  }

  return (
    <ProfessionalProfileDialog title="Editar perfil" onClose={onClose}>
      <form className="professional-profile-form" onSubmit={submit}>
        <label className="professional-profile-form__field">
          Nome profissional
          <input name="name" value={draft.name} onChange={updateField} required />
        </label>
        <label className="professional-profile-form__field">
          Especialidade principal
          <input name="specialty" value={draft.specialty} onChange={updateField} required />
        </label>
        <label className="professional-profile-form__field">
          Especialidade secundária
          <input name="secondarySpecialty" value={draft.secondarySpecialty} onChange={updateField} />
        </label>
        <label className="professional-profile-form__field">
          E-mail
          <input name="email" type="email" value={draft.email} onChange={updateField} required />
        </label>
        <button className="professional-profile-form__submit" type="submit">Salvar alterações</button>
      </form>
    </ProfessionalProfileDialog>
  )
}

export default ProfessionalProfileEditor
