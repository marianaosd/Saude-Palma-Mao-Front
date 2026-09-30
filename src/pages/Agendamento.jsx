function Agendamento({ onBack, onConfirmar }) {
  return (
    <section className="booking-page" aria-labelledby="booking-title">
      <div className="booking-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Agendamento</p>

        <h1 id="booking-title">
          Confirme sua consulta
        </h1>

        <p>
          Confira os dados do atendimento antes de confirmar o agendamento.
        </p>
      </div>

      <div className="booking-card">
        <div className="booking-section">
          <span className="card-label">Profissional</span>

          <h2>Dr. Rafael Almeida</h2>

          <p>Clínico Geral</p>
        </div>

        <div className="booking-section">
          <span className="card-label">Local</span>

          <h2>Centro Médico Recife</h2>

          <p>Boa Vista · Recife</p>
        </div>

        <div className="booking-section">
          <span className="card-label">Data e horário</span>

          <h2>Hoje · 14:00</h2>

          <p>Atendimento clínico geral</p>
        </div>

        <div className="booking-warning">
          <strong>Antes de confirmar</strong>

          <p>
            Verifique se os dados da consulta estão corretos.
            O agendamento poderá ser consultado posteriormente na sua área do paciente.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onConfirmar}
        >
          Confirmar agendamento
        </button>
      </div>
    </section>
  )
}

export default Agendamento