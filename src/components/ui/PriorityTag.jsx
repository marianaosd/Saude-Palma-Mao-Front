import './PriorityTag.css'

const labels = {
  urgent: 'Urgente',
  emergency: 'Emergência',
  moderate: 'Moderado',
}

function PriorityTag({ priority }) {
  return (
    <span className={`priority-tag priority-tag--${priority}`}>
      <span className="priority-tag__dot" aria-hidden="true" />
      {labels[priority]}
    </span>
  )
}

export default PriorityTag
