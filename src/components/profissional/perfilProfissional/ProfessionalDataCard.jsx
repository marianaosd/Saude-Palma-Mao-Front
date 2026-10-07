import './ProfessionalDataCard.css'

function ProfessionalDataCard({ professional: profile }) {
  const details = [
    { label: 'CRM', value: `CRM/SP ${profile.registration.replace('CRM ', '')}` },
    { label: 'Especialidade principal', value: profile.specialty },
    { label: 'Especialidade secundária', value: profile.secondarySpecialty },
    { label: 'E-mail', value: profile.email },
  ]

  return (
    <section className="professional-data-card" aria-labelledby="professional-data-title">
      <h2 id="professional-data-title">Dados profissionais</h2>
      <dl className="professional-data-card__fields">
        {details.map(({ label, value }) => (
          <div className="professional-data-card__field" key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default ProfessionalDataCard
