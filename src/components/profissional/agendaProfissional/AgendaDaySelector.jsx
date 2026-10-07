import './AgendaDaySelector.css'

function AgendaDaySelector({ days, selectedDayId, onSelectDay }) {
  return (
    <div className="agenda-day-selector" role="group" aria-label="Selecionar dia da agenda">
      {days.map((day) => {
        const selected = day.id === selectedDayId

        return (
          <button
            className={`agenda-day-selector__day${selected ? ' agenda-day-selector__day--selected' : ''}`}
            key={day.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onSelectDay(day.id)}
          >
            <span>{day.weekday}</span>
            <strong>{day.date}</strong>
          </button>
        )
      })}
    </div>
  )
}

export default AgendaDaySelector
