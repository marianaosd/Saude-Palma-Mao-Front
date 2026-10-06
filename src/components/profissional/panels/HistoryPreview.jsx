function HistoryPreview({ records }) {
  return (
    <>
      <p className="professional-panel__description">18 de setembro</p>
      <ul className="professional-panel__list">
        {records.map((record) => (
          <li className="professional-panel__history" key={record.initials}>
            <span className="professional-panel__avatar" aria-hidden="true">{record.initials}</span>
            <span className="professional-panel__appointment-details">
              <strong>{record.name}</strong>
              <span>{record.detail} · {record.time}</span>
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default HistoryPreview
