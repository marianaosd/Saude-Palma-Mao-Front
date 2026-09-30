function Confirmacao({ onPaciente, onHome }) {
  return (
    <section
      className="confirmation-page"
      aria-labelledby="confirmation-title"
    >
      <div className="confirmation-card">
        <p className="eyebrow">Agendamento confirmado</p>

        <div className="confirmation-icon" aria-hidden="true">
          ✓
        </div>

        <h1 id="confirmation-title">
          Consulta agendada com sucesso
        </h1>

        <p className="confirmation-description">
          Seu atendimento foi confirmado. Confira abaixo os dados
          da sua consulta.
        </p>

        <div className="confirmation-details">
          <div className="confirmation-detail">
            <span className="card-label">Profissional</span>

            <h2>Dr. Rafael Almeida</h2>

            <p>Clínico Geral</p>
          </div>

          <div className="confirmation-detail">
            <span className="card-label">Local</span>

            <h2>Centro Médico Recife</h2>

            <p>Boa Vista · Recife</p>
          </div>

          <div className="confirmation-detail">
            <span className="card-label">Data e horário</span>

            <h2>Hoje · 14:00</h2>

            <p>Atendimento clínico geral</p>
          </div>
        </div>

        <div className="confirmation-note">
          <strong>Pronto!</strong>

          <p>
            Você poderá consultar este agendamento posteriormente
            na sua área do paciente.
          </p>
        </div>

        <div className="confirmation-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onPaciente}
          >
            Ir para área do paciente
          </button>

          <button
            type="button"
            className="back-home-button"
            onClick={onHome}
          >
            Voltar ao início
          </button>
        </div>
      </div>
    </section>
  )
}

export default Confirmacao