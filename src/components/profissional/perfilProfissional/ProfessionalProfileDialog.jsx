import { useEffect, useRef } from 'react'
import './ProfessionalProfileDialog.css'

function ProfessionalProfileDialog({ title, children, onClose }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    if (!dialogRef.current.open) dialogRef.current.showModal()
  }, [])

  return (
    <dialog
      className="professional-profile-dialog"
      ref={dialogRef}
      aria-labelledby="professional-profile-dialog-title"
      onClose={onClose}
    >
      <header className="professional-profile-dialog__header">
        <h2 id="professional-profile-dialog-title">{title}</h2>
        <button type="button" onClick={() => dialogRef.current.close()}>Fechar</button>
      </header>
      <div className="professional-profile-dialog__content">{children}</div>
    </dialog>
  )
}

export default ProfessionalProfileDialog
