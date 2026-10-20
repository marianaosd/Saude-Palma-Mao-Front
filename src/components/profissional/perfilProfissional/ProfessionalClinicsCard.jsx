import ProfessionalIcon from '../ProfessionalIcon.jsx'
import './ProfessionalClinicsCard.css'

function ProfessionalClinicsCard({ clinics }) {
  const subtitulo = `${clinics.length} ${clinics.length === 1 ? 'local' : 'locais'} de atendimento`

  return (
    <section className="professional-clinics-card" aria-labelledby="professional-clinics-title">
      <header className="professional-clinics-card__heading">
        <div>
          <h2 id="professional-clinics-title">Clínicas vinculadas</h2>
          <p>{subtitulo}</p>
        </div>
      </header>
      <ul className="professional-clinics-card__list">
        {clinics.map((clinic) => (
          <li className="professional-clinics-card__clinic" key={clinic.id}>
            <span className="professional-clinics-card__icon" aria-hidden="true">
              <ProfessionalIcon name="profileClinicBuilding" />
            </span>
            <span className="professional-clinics-card__details">
              <strong>{clinic.name}</strong>
              {clinic.days && <span>{clinic.days}</span>}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProfessionalClinicsCard
