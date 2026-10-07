import { useState } from 'react'
import ProfessionalProfileDialog from './ProfessionalProfileDialog.jsx'

function ClinicForm({ onSave, onClose }) {
  const [name, setName] = useState('')
  const [days, setDays] = useState('')

  function submit(event) {
    event.preventDefault()
    onSave({
      id: `clinic-${Date.now()}`,
      name: name.trim(),
      days: days.trim(),
    })
  }

  return (
    <ProfessionalProfileDialog title="Adicionar clínica" onClose={onClose}>
      <form className="professional-profile-form" onSubmit={submit}>
        <label className="professional-profile-form__field">
          Nome do local
          <input value={name} onChange={(event) => setName(event.currentTarget.value)} required />
        </label>
        <label className="professional-profile-form__field">
          Dias de atendimento
          <input
            value={days}
            onChange={(event) => setDays(event.currentTarget.value)}
            placeholder="Ex.: Seg e Qua"
            required
          />
        </label>
        <button className="professional-profile-form__submit" type="submit">Adicionar clínica</button>
      </form>
    </ProfessionalProfileDialog>
  )
}

export default ClinicForm
