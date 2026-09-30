function Home({ onLogin }) {
  return (
    <>
      <section id="inicio" className="hero" aria-labelledby="home-title">
        <div className="hero-content">
          <p className="eyebrow">Saúde na Palma da Mão</p>

          <h1 id="home-title">
            O cuidado começa com um primeiro passo.
          </h1>

          <p className="hero-description">
            Uma solução digital para facilitar o acesso ao atendimento,
            organizar informações e reduzir o tempo de espera nas clínicas.
          </p>

          <div className="hero-actions">
            <a className="primary-link" href="#proposta">
              Conheça a proposta
            </a>

            <button
              type="button"
              className="secondary-button"
              onClick={onLogin}
            >
              Entrar na plataforma
            </button>
          </div>
        </div>
      </section>

      <section
        id="proposta"
        className="proposal"
        aria-labelledby="proposal-title"
      >
        <div>
          <p className="eyebrow">A proposta</p>

          <h2 id="proposal-title">
            Menos tempo na fila, mais atenção às pessoas.
          </h2>

          <p>
            O Saúde na Palma da Mão conecta pacientes, profissionais de saúde
            e clínicas em uma aplicação acessível pelo celular.
          </p>

          <p>
            A proposta é permitir que algumas etapas do atendimento, como a
            pré-triagem e o agendamento, possam começar antes da chegada à
            clínica.
          </p>
        </div>

        <div className="proposal-highlight">
          <span className="highlight-icon" aria-hidden="true">
            +
          </span>

          <div>
            <strong>Atendimento mais organizado</strong>

            <p>
              Informações reunidas para facilitar a jornada do paciente e o
              trabalho dos profissionais.
            </p>
          </div>
        </div>
      </section>

      <section
        id="publicos"
        className="audience"
        aria-labelledby="audience-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Para quem estamos construindo</p>

          <h2 id="audience-title">
            Três perfis, um cuidado mais próximo.
          </h2>

          <p>
            A aplicação foi pensada para atender diferentes necessidades
            dentro da jornada de atendimento.
          </p>
        </div>
      </section>

      <section className="access-section" aria-labelledby="access-title">
        <div>
          <p className="eyebrow">Saúde na Palma da Mão</p>

          <h2 id="access-title">
            Comece sua jornada de atendimento de forma mais simples.
          </h2>

          <p>
            A plataforma está em desenvolvimento como parte de um Projeto
            Integrador do curso de Análise e Desenvolvimento de Sistemas.
          </p>
        </div>

        <button
          type="button"
          className="secondary-link"
          onClick={onLogin}
        >
          Entrar na plataforma
        </button>
      </section>

      <p className="project-note">
        Projeto acadêmico em desenvolvimento.
      </p>
    </>
  )
}

export default Home
