import { useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import ClinicForm from '../../components/profissional/perfilProfissional/ClinicForm.jsx'
import ProfessionalClinicsCard from '../../components/profissional/perfilProfissional/ProfessionalClinicsCard.jsx'
import ProfessionalDataCard from '../../components/profissional/perfilProfissional/ProfessionalDataCard.jsx'
import ProfessionalProfileEditor from '../../components/profissional/perfilProfissional/ProfessionalProfileEditor.jsx'
import { professional as initialProfessional, professionalClinics as initialClinics } from '../../data/profissional.js'
import './PerfilProfissional.css'

function PerfilProfissional() {
  const [profile, setProfile] = useState(initialProfessional)
  const [clinics, setClinics] = useState(initialClinics)
  const [dialog, setDialog] = useState(null)

  function navigate(destination) {
    const routes = {
      inicio: '#profissional',
      agenda: '#agenda-profissional',
      historico: '#historico-profissional',
      perfil: '#perfil-profissional',
    }
    window.location.hash = routes[destination]
  }

  return (
    <ProfessionalLayout activePage="perfil" onNavigate={navigate}>
      <div className="professional-profile">
        <header className="professional-profile__header">
          <div className="professional-profile__title-row">
            <h1>Perfil profissional</h1>
            <button className="professional-profile__edit" type="button" onClick={() => setDialog('edit')}>
              <ProfessionalIcon name="profileEdit" />
              <span>Editar</span>
            </button>
          </div>
          <div className="professional-profile__identity">
            <div className="professional-profile__avatar" aria-hidden="true">{profile.initials}</div>
            <div className="professional-profile__identity-copy">
              <h2>{profile.name}</h2>
              <p>{profile.specialty}</p>
              <span>Perfil verificado</span>
            </div>
          </div>
        </header>

        <main className="professional-profile__main" id="professional-content" tabIndex={-1}>
          <ProfessionalDataCard professional={profile} />
          <ProfessionalClinicsCard clinics={clinics} onAddClinic={() => setDialog('clinic')} />
          <button className="professional-profile__logout" type="button" onClick={() => { window.location.hash = '#inicio' }}>
            <ProfessionalIcon name="profileLogout" />
            <span>Sair da conta</span>
          </button>
        </main>
      </div>

      {dialog === 'edit' && (
        <ProfessionalProfileEditor
          professional={profile}
          onClose={() => setDialog(null)}
          onSave={(updatedProfile) => { setProfile(updatedProfile); setDialog(null) }}
        />
      )}
      {dialog === 'clinic' && (
        <ClinicForm
          onClose={() => setDialog(null)}
          onSave={(clinic) => { setClinics((current) => [...current, clinic]); setDialog(null) }}
        />
      )}
    </ProfessionalLayout>
  )
}

export default PerfilProfissional
