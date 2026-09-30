function Paciente({ onTriagem, onBack }) {
  return (
    <section className="patient-page" aria-labelledby="patient-title">
      <div className="patient-header">
        <div>
          <p className="eyebrow">Área do paciente</p>

          <h1 id="patient-title">Bom dia, Maria! 👋</h1>

          <p>
            Como podemos ajudar você hoje?
          </p>
        </div>

        <button
          type="button"
          className="back-home-button patient-back-button"
          onClick={onBack}
        >
          ← Sair
        </button>
      </div>

      <section className="triage-card" aria-labelledby="triage-title">
        <div>
          <span className="card-label">Próximo passo</span>

          <h2 id="triage-title">
            Precisa de atendimento?
          </h2>

          <p>
            Responda algumas perguntas sobre como você está se sentindo.
            A pré-triagem ajuda a orientar o próximo passo.
          </p>
        </div>

        <button
          type="button"
          className="primary-button triage-button"
          onClick={onTriagem}
        >
          Iniciar pré-triagem
        </button>
      </section>

      <section
        className="quick-actions"
        aria-labelledby="quick-actions-title"
      >
        <div className="section-heading">
          <p className="eyebrow">Acesso rápido</p>

          <h2 id="quick-actions-title">
            O que você precisa?
          </h2>
        </div>

        <div className="quick-actions-grid">
          <button type="button" className="quick-action">
            <strong>Meus agendamentos</strong>
            <span>Consulte suas próximas consultas.</span>
          </button>

          <button type="button" className="quick-action">
            <strong>Clínicas próximas</strong>
            <span>Encontre locais de atendimento.</span>
          </button>

          <button type="button" className="quick-action">
            <strong>Histórico</strong>
            <span>Veja seus atendimentos anteriores.</span>
          </button>
        </div>
      </section>

      <section className="patient-info-grid">
        <article className="info-card">
          <p className="eyebrow">Dica de saúde</p>

          <h2>Cuide-se também fora da consulta.</h2>

          <p>
            Manter uma rotina de cuidados e buscar orientação profissional
            quando necessário pode ajudar no acompanhamento da sua saúde.
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">Consulta recente</p>

          <h2>Clínico Geral</h2>

          <p>
            Centro Médico Recife
          </p>

          <span className="appointment-status">
            Consulta realizada
          </span>
        </article>
      </section>
    </section>
  )
}

export default Paciente