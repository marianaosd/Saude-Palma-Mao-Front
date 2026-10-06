import PriorityTag from '../../ui/PriorityTag.jsx'

function AgendaPanel({ appointments }) {
  return (
    <>
      <p className="professional-panel__description">
        Segunda-feira, 22 · {appointments.length} consultas agendadas
      </p>
      <ul className="professional-panel__list">
        {appointments.map((appointment) => (
          <li className="professional-panel__appointment" key={appointment.id}>
            <time dateTime={appointment.time}>{appointment.time}</time>
            <span className="professional-panel__appointment-details">
              <strong>{appointment.name}</strong>
              <span>{appointment.symptoms}</span>
              <PriorityTag priority={appointment.priority} />
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default AgendaPanel
