import { useEffect, useRef } from 'react'
import './HistoryDetailDialog.css'

function HistoryDetailDialog({ record, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal()
  }, [])

  return (
    <dialog
      className="professional-history-detail"
      ref={dialogRef}
      aria-labelledby="professional-history-detail-title"
      onClose={onClose}
    >
      <header className="professional-history-detail__header">
        <h2 id="professional-history-detail-title">Consulta concluída</h2>
        <button type="button" onClick={() => dialogRef.current.close()}>Fechar</button>
      </header>
      <div className="professional-history-detail__content">
        <div className="professional-history-detail__patient">
          <span aria-hidden="true">{record.initials}</span>
          <strong>{record.name}</strong>
        </div>
        <p>{record.date} · {record.time}</p>
        <p>{record.detail}</p>
      </div>
    </dialog>
  )
}

export default HistoryDetailDialog
