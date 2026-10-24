import { useState } from 'react'
import ClinicasAdmin from './ClinicasAdmin.jsx'
import './Admin.css'

function Admin({ admin, onLogout }) {
  const [secao, setSecao] = useState('clinicas')

  return (
    <div className="admin-shell">
      <header className="admin-header">
        <div className="admin-header__content">
          <div className="admin-header__identity">
            <h1 className="admin-header__title">Área administrativa</h1>
            {admin?.email && (
              <span className="admin-header__email">{admin.email}</span>
            )}
          </div>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={onLogout}
          >
            Sair
          </button>
        </div>
      </header>

      <nav className="admin-nav" aria-label="Navegação da administração">
        <div className="admin-nav__content">
          <button
            type="button"
            className={`admin-nav__item ${secao === 'clinicas' ? 'admin-nav__item--active' : ''}`}
            aria-pressed={secao === 'clinicas'}
            onClick={() => setSecao('clinicas')}
          >
            Clínicas
          </button>
          <button
            type="button"
            className={`admin-nav__item ${secao === 'especialidades' ? 'admin-nav__item--active' : ''}`}
            aria-pressed={secao === 'especialidades'}
            onClick={() => setSecao('especialidades')}
          >
            Especialidades
          </button>
          <button
            type="button"
            className={`admin-nav__item ${secao === 'profissionais' ? 'admin-nav__item--active' : ''}`}
            aria-pressed={secao === 'profissionais'}
            onClick={() => setSecao('profissionais')}
          >
            Profissionais
          </button>
        </div>
      </nav>

      <main className="admin-main">
        {secao === 'clinicas' ? (
          <ClinicasAdmin />
        ) : (
          <p>Seção em construção.</p>
        )}
      </main>
    </div>
  )
}

export default Admin
