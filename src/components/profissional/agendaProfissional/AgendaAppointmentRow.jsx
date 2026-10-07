import PriorityTag from '../../ui/PriorityTag.jsx'
import './AgendaAppointmentRow.css'

function AgendaAppointmentRow({ appointment, onOpen }) {
  return (
    <button
      className="agenda-appointment-row"
      type="button"
      onClick={() => onOpen(appointment)}
      aria-label={`Abrir consulta de ${appointment.name} às ${appointment.time}`}
    >
      <time className="agenda-appointment-row__time" dateTime={appointment.time}>
        {appointment.time}
      </time>
      <span className="agenda-appointment-row__marker" aria-hidden="true" />
      <span className="agenda-appointment-row__details">
        <strong>{appointment.name}</strong>
        <span>{appointment.symptoms}</span>
      </span>
      {appointment.priority && <PriorityTag priority={appointment.priority} />}
    </button>
  )
}

export default AgendaAppointmentRow
