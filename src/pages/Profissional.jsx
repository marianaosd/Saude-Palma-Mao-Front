function Profissional({ onBack, onAgendar }) {
  return (
    <section className="professional-page" aria-labelledby="professional-title">
      <div className="professional-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Profissional de saúde</p>

        <h1 id="professional-title">
          Escolha um profissional
        </h1>

        <p>
          Selecione o profissional e um horário disponível para sua consulta.
        </p>
      </div>

      <article className="professional-card">
        <div className="professional-info">
          <span className="card-label">Clínico Geral</span>

          <h2>Dr. Rafael Almeida</h2>

          <p>Centro Médico Recife</p>

          <span className="professional-details">
            Atendimento clínico geral
          </span>
        </div>

        <div className="schedule">
          <h3>Horários disponíveis</h3>

          <div className="schedule-grid">
            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Hoje · 14:00
            </button>

            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Hoje · 15:30
            </button>

            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Amanhã · 09:00
            </button>

            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Amanhã · 10:30
            </button>
          </div>
        </div>
      </article>

      <article className="professional-card">
        <div className="professional-info">
          <span className="card-label">Clínico Geral</span>

          <h2>Dra. Camila Santos</h2>

          <p>Centro Médico Recife</p>

          <span className="professional-details">
            Atendimento clínico geral
          </span>
        </div>

        <div className="schedule">
          <h3>Horários disponíveis</h3>

          <div className="schedule-grid">
            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Hoje · 16:00
            </button>

            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Amanhã · 08:30
            </button>

            <button
              type="button"
              className="schedule-option"
              onClick={onAgendar}
            >
              Amanhã · 11:00
            </button>
          </div>
        </div>
      </article>
    </section>
  )
}

export default Profissional