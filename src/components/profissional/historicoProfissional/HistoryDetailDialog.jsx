import { useEffect, useRef } from 'react'
import TriagePanel from '../panels/TriagePanel.jsx'
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
        <h2 id="professional-history-detail-title">Detalhes da consulta</h2>
        <button type="button" onClick={() => dialogRef.current.close()}>Fechar</button>
      </header>
      <div className="professional-history-detail__content">
        <div className="professional-history-detail__patient">
          <span aria-hidden="true">{record.initials}</span>
          <strong>{record.name}</strong>
        </div>
        <p>{record.date} · {record.time} · {record.statusLabel}</p>
        <p>{record.detail}</p>
        {record.id_triagem
          ? <TriagePanel appointment={record} />
          : <p>Sem pré-triagem registrada.</p>
        }
      </div>
    </dialog>
  )
}

export default HistoryDetailDialog
