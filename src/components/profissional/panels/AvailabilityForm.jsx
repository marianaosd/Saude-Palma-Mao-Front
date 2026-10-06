import { useState } from 'react'

function AvailabilityForm({ hours, onSave }) {
  const [draft, setDraft] = useState(hours)
  const [saved, setSaved] = useState(false)

  function submit(event) {
    event.preventDefault()
    if (draft.start >= draft.end) {
      event.currentTarget.elements.end.setCustomValidity('O horário de término deve ser posterior ao início.')
      event.currentTarget.reportValidity()
      return
    }
    onSave(draft)
    setSaved(true)
  }

  function changeTime(event) {
    event.currentTarget.setCustomValidity('')
    setDraft({ ...draft, [event.currentTarget.name]: event.currentTarget.value })
    setSaved(false)
  }

  return (
    <form className="professional-panel__form" onSubmit={submit}>
      <p className="professional-panel__description">Segunda a sexta-feira</p>
      <label className="professional-panel__field">
        Início do atendimento
        <input name="start" type="time" value={draft.start} onChange={changeTime} required />
      </label>
      <label className="professional-panel__field">
        Fim do atendimento
        <input name="end" type="time" value={draft.end} onChange={changeTime} required />
      </label>
      {saved && (
        <p className="professional-panel__saved" role="status">
          Horários atualizados para {draft.start}–{draft.end}.
        </p>
      )}
      <button className="professional-panel__submit" type="submit">Salvar horários</button>
    </form>
  )
}

export default AvailabilityForm
