import { useEffect, useRef } from 'react'
import AgendaPreview from './panels/AgendaPreview.jsx'
import HistoryPreview from './panels/HistoryPreview.jsx'
import AvailabilityForm from './panels/AvailabilityForm.jsx'
import ProfilePreview from './panels/ProfilePreview.jsx'
import TriagePanel from './panels/TriagePanel.jsx'
import './ProfessionalHomePanel.css'

const headings = {
  agenda: 'Agenda',
  historico: 'Histórico',
  horarios: 'Configurar horários',
  notificacoes: 'Notificações',
  perfil: 'Perfil profissional',
  triagem: 'Pré-triagem',
}

function PanelHeading({ title, onClose }) {
  return (
    <header className="professional-panel__heading">
      <h2 id="professional-panel-title">{title}</h2>
      <button className="professional-panel__close" type="button" onClick={onClose}>
        Fechar
      </button>
    </header>
  )
}

function ProfessionalHomePanel({
  panel,
  professional,
  appointments,
  historyRecords,
  hours,
  onSaveHours,
  onClose,
}) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal()
  }, [])

  let content
  if (panel.type === 'agenda') content = <AgendaPreview appointments={appointments} />
  else if (panel.type === 'historico') content = <HistoryPreview records={historyRecords} />
  else if (panel.type === 'horarios') content = <AvailabilityForm hours={hours} onSave={onSaveHours} />
  else if (panel.type === 'perfil') content = <ProfilePreview professional={professional} />
  else if (panel.type === 'triagem') content = <TriagePanel appointment={panel.appointment} />
  else content = <p className="professional-panel__empty">Você está em dia.</p>

  return (
    <dialog
      className="professional-panel"
      ref={dialogRef}
      aria-labelledby="professional-panel-title"
      onClose={onClose}
    >
      <PanelHeading title={headings[panel.type]} onClose={() => dialogRef.current.close()} />
      <div className="professional-panel__content">
        {content}
      </div>
    </dialog>
  )
}

export default ProfessionalHomePanel
