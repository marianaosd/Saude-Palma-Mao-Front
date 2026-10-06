import './EscolhaProfissional.css'

function EscolhaProfissional({ onBack, onAgendar }) {
  return (
    <section className="professional-selection-page" aria-labelledby="professional-selection-title">
      <div className="professional-selection-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Profissional de saúde</p>

        <h1 id="professional-selection-title">
          Escolha um profissional
        </h1>

        <p>
          Selecione o profissional e um horário disponível para sua consulta.
        </p>
      </div>

      <article className="professional-selection-card">
        <div className="professional-selection-info">
          <span className="card-label">Clínico Geral</span>

          <h2>Dr. Rafael Almeida</h2>

          <p>Centro Médico Recife</p>

          <span className="professional-selection-details">
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

      <article className="professional-selection-card">
        <div className="professional-selection-info">
          <span className="card-label">Clínico Geral</span>

          <h2>Dra. Camila Santos</h2>

          <p>Centro Médico Recife</p>

          <span className="professional-selection-details">
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

export default EscolhaProfissional
