import PriorityTag from '../../ui/PriorityTag.jsx'

function TriagePanel({ appointment }) {
  return (
    <div className="professional-panel__triage">
      <p>{appointment.time} · {appointment.name}</p>
      <h3>Informações relatadas</h3>
      <p>{appointment.symptoms}</p>
      <PriorityTag priority={appointment.priority} />
    </div>
  )
}

export default TriagePanel
