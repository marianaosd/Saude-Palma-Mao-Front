import ProfessionalIcon from '../ProfessionalIcon.jsx'
import './ProfessionalClinicsCard.css'

function ProfessionalClinicsCard({ clinics, onAddClinic }) {
  return (
    <section className="professional-clinics-card" aria-labelledby="professional-clinics-title">
      <header className="professional-clinics-card__heading">
        <div>
          <h2 id="professional-clinics-title">Clínicas vinculadas</h2>
          <p>{clinics.length} locais de atendimento</p>
        </div>
        <button
          className="professional-clinics-card__add"
          type="button"
          aria-label="Adicionar clínica"
          onClick={onAddClinic}
        >
          <ProfessionalIcon name="profileClinicAdd" />
        </button>
      </header>
      <ul className="professional-clinics-card__list">
        {clinics.map((clinic) => (
          <li className="professional-clinics-card__clinic" key={clinic.id}>
            <span className="professional-clinics-card__icon" aria-hidden="true">
              <ProfessionalIcon name="profileClinicBuilding" />
            </span>
            <span className="professional-clinics-card__details">
              <strong>{clinic.name}</strong>
              <span>{clinic.days}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default ProfessionalClinicsCard
