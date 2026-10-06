import ProfessionalIcon from '../ProfessionalIcon.jsx'
import './AgendaAvailableSlot.css'

function AgendaAvailableSlot({ time }) {
  return (
    <div className="agenda-available-slot">
      <time dateTime={time}>{time}</time>
      <ProfessionalIcon name="agendaSlotPlus" />
      <span>Horário disponível</span>
    </div>
  )
}

export default AgendaAvailableSlot
