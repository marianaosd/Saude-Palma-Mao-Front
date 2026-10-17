import { humanizarAcao } from '../../services/agenda.js'
import './Resultado.css'

function Resultado({ onBack, onClinicas, categoria }) {
  const orientacao = humanizarAcao(categoria?.acao_imediata)

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
          Com base na categoria que você escolheu, este é o próximo passo
          sugerido. Esta orientação não é um diagnóstico médico.
        </p>

        <div className="result-priority">
          <span className="card-label">Orientação</span>

          <h2>{categoria?.nome_categoria || 'Pré-triagem registrada'}</h2>

          <p>{orientacao}.</p>
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
