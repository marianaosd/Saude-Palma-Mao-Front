function Clinicas({ onBack, onSelecionar }) {
  return (
    <section className="clinics-page" aria-labelledby="clinics-title">
      <div className="clinics-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Clínicas</p>

        <h1 id="clinics-title">
          Escolha onde deseja ser atendido
        </h1>

        <p>
          Encontre uma unidade de atendimento e escolha o profissional
          disponível para sua consulta.
        </p>
      </div>

      <div className="clinics-list">
        <article className="clinic-card">
          <div>
            <span className="card-label">Clínica</span>

            <h2>Centro Médico Recife</h2>

            <p>Boa Vista · Recife</p>

            <span className="clinic-info">
              Atendimento clínico geral
            </span>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onSelecionar}
          >
            Ver profissionais
          </button>
        </article>

        <article className="clinic-card">
          <div>
            <span className="card-label">Clínica</span>

            <h2>Clínica Saúde Recife</h2>

            <p>Ilha do Leite · Recife</p>

            <span className="clinic-info">
              Atendimento clínico geral
            </span>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onSelecionar}
          >
            Ver profissionais
          </button>
        </article>

        <article className="clinic-card">
          <div>
            <span className="card-label">Clínica</span>

            <h2>Centro de Saúde Boa Viagem</h2>

            <p>Boa Viagem · Recife</p>

            <span className="clinic-info">
              Atendimento clínico geral
            </span>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={onSelecionar}
          >
            Ver profissionais
          </button>
        </article>
      </div>
    </section>
  )
}

export default Clinicas