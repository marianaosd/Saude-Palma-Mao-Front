import './ProfessionalDataCard.css'

function ProfessionalDataCard({ professional: profile }) {
  const details = [
    { label: 'Registro profissional', value: profile.registration },
    { label: 'Especialidade principal', value: profile.specialty },
    { label: 'E-mail',                 value: profile.email },
    { label: 'Telefone',               value: profile.telefone || 'Não informado' },
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
