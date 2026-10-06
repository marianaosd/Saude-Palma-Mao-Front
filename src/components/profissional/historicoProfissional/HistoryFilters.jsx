import './HistoryFilters.css'

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'month', label: 'Este mês' },
  { id: 'returns', label: 'Retornos' },
]

function HistoryFilters({ selectedFilter, onChange }) {
  return (
    <div className="professional-history__filters" role="group" aria-label="Filtrar histórico">
      {filters.map(({ id, label }) => (
        <button
          className={`professional-history__filter${selectedFilter === id ? ' professional-history__filter--selected' : ''}`}
          key={id}
          type="button"
          aria-pressed={selectedFilter === id}
          onClick={() => onChange(id)}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

export default HistoryFilters
