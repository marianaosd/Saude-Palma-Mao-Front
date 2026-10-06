import ProfessionalIcon from '../ProfessionalIcon.jsx'
import './HistoryCard.css'

function HistoryCard({ record, onOpen }) {
  return (
    <button
      className="professional-history-card"
      type="button"
      aria-label={`Ver histórico de ${record.name}: ${record.detail}`}
      onClick={() => onOpen(record)}
    >
      <span className="professional-history-card__avatar" aria-hidden="true">
        {record.initials}
      </span>
      <span className="professional-history-card__details">
        <strong>{record.name}</strong>
        <span className="professional-history-card__description">{record.detail}</span>
        <span className="professional-history-card__completion">
          <ProfessionalIcon name="historyCheck" />
          <span>Concluído às {record.time}</span>
        </span>
      </span>
      <span className="professional-history-card__chevron" aria-hidden="true">
        <ProfessionalIcon name="historyChevron" />
      </span>
    </button>
  )
}

export default HistoryCard
