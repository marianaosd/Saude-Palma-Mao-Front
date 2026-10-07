import PriorityTag from '../ui/PriorityTag.jsx'
import './AppointmentCard.css'

function AppointmentCard({ appointment, highlighted = false, onViewTriage }) {
  return (
    <article
      className={`appointment-card${highlighted ? ' appointment-card--highlighted' : ''}`}
      aria-labelledby={`appointment-${appointment.id}`}
    >
      <div className="appointment-card__details">
        <div className="appointment-card__timeline">
          <time dateTime={appointment.time}>{appointment.time}</time>
          <span aria-hidden="true" />
        </div>
        <div className="appointment-card__avatar" aria-hidden="true">
          {appointment.initials}
        </div>
        <div className="appointment-card__patient">
          <h3 id={`appointment-${appointment.id}`}>{appointment.name}</h3>
          <p>{appointment.symptoms}</p>
          <PriorityTag priority={appointment.priority} />
        </div>
      </div>
      <button
        className="appointment-card__action"
        type="button"
        onClick={() => onViewTriage(appointment)}
        aria-label={`Ver pré-triagem de ${appointment.name}`}
      >
        Ver pré-triagem
      </button>
    </article>
  )
}

export default AppointmentCard
