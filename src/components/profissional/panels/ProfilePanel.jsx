function ProfilePanel({ professional }) {
  return (
    <div className="professional-panel__profile">
      <span className="professional-panel__avatar">{professional.initials}</span>
      <strong>{professional.name}</strong>
      <span>{professional.specialty} · {professional.registration}</span>
      <span>{professional.email}</span>
      <a href="#inicio">Voltar à página inicial</a>
    </div>
  )
}

export default ProfilePanel
