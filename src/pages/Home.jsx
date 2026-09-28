import ProfileCard from '../components/ProfileCard.jsx'
import { profiles } from '../data/profiles.js'

function Home() {
  return (
    <>
      <section id="inicio" className="hero" aria-labelledby="home-title">
        <p className="eyebrow">Projeto acadêmico em desenvolvimento</p>
        <h1 id="home-title">O cuidado começa com um primeiro passo.</h1>
        <p className="hero-description">
          O Saúde na Palma da Mão é uma proposta para facilitar o acesso ao
          atendimento e reduzir a espera nas recepções de clínicas.
        </p>
        <a className="primary-link" href="#proposta">Conheça a proposta</a>
      </section>

      <section id="proposta" className="proposal" aria-labelledby="proposal-title">
        <p className="eyebrow">A proposta</p>
        <h2 id="proposal-title">Menos tempo na fila, mais atenção às pessoas.</h2>
        <p>
          Queremos conectar pacientes, profissionais de saúde e clínicas em uma
          aplicação acessível pelo celular. A ideia é permitir que etapas como
          o registro inicial de informações e o agendamento comecem antes da
          chegada à recepção.
        </p>
      </section>

      <section id="publicos" className="audience" aria-labelledby="audience-title">
        <p className="eyebrow">Para quem estamos construindo</p>
        <h2 id="audience-title">Três perfis, um cuidado mais próximo.</h2>
        <p>Estas são algumas das funcionalidades previstas para cada perfil.</p>
        <div className="profile-grid">
          {profiles.map((profile) => (
            <ProfileCard
              key={profile.id}
              title={profile.title}
              description={profile.description}
              features={profile.features}
            />
          ))}
        </div>
      </section>

      <p className="project-note">
        Esta é uma apresentação inicial do projeto. As funcionalidades serão
        desenvolvidas ao longo das próximas etapas.
      </p>
    </>
  )
}

export default Home
