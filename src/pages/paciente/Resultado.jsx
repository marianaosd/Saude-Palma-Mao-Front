import './Resultado.css'

function Resultado({ onBack, onClinicas }) {
  return (
    <section className="result-page" aria-labelledby="result-title">
      <div className="result-card">
        <p className="eyebrow">Resultado da pré-triagem</p>

        <div className="result-icon" aria-hidden="true">
          ✓
        </div>

        <h1 id="result-title">
          Orientação de atendimento
        </h1>

        <p className="result-description">
          Com base nas respostas informadas, recomendamos procurar
          atendimento em uma unidade de saúde.
        </p>

        <div className="result-priority">
          <span className="card-label">Orientação</span>

          <h2>Atendimento moderado</h2>

          <p>
            Você pode buscar uma consulta em uma clínica ou unidade
            de atendimento de sua preferência.
          </p>
        </div>

        <div className="result-warning">
          <strong>Importante</strong>

          <p>
            Esta orientação não é um diagnóstico médico. Se os sintomas
            piorarem ou houver uma situação de emergência, procure
            imediatamente um serviço de urgência ou emergência.
          </p>
        </div>

        <div className="result-actions">
          <button
            type="button"
            className="primary-button"
            onClick={onClinicas}
          >
            Encontrar clínicas
          </button>

          <button
            type="button"
            className="back-home-button"
            onClick={onBack}
          >
            ← Refazer pré-triagem
          </button>
        </div>
      </div>
    </section>
  )
}

export default Resultado
