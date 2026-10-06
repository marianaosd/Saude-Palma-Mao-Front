import './Triagem.css'

function Triagem({ onBack, onResultado }) {
  return (
    <section className="triage-page" aria-labelledby="triage-page-title">
      <div className="triage-page-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Pré-triagem</p>

        <h1 id="triage-page-title">
          Vamos entender como você está
        </h1>

        <p>
          Responda algumas perguntas sobre o que está sentindo.
          Suas respostas ajudam a orientar o próximo passo do atendimento.
        </p>
      </div>

      <form className="triage-form">
        <fieldset className="triage-question">
          <legend>1. O que você está sentindo?</legend>

          <label className="triage-option">
            <input
              type="radio"
              name="symptom"
              value="dor"
            />
            <span>Estou sentindo dor</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="symptom"
              value="febre"
            />
            <span>Estou com febre</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="symptom"
              value="respiracao"
            />
            <span>Estou com dificuldade para respirar</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="symptom"
              value="outro"
            />
            <span>Outro sintoma</span>
          </label>
        </fieldset>

        <fieldset className="triage-question">
          <legend>2. Há quanto tempo você está sentindo isso?</legend>

          <label className="triage-option">
            <input
              type="radio"
              name="duration"
              value="hoje"
            />
            <span>Começou hoje</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="duration"
              value="dias"
            />
            <span>Há alguns dias</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="duration"
              value="semana"
            />
            <span>Há mais de uma semana</span>
          </label>
        </fieldset>

        <fieldset className="triage-question">
          <legend>3. Como você considera a intensidade?</legend>

          <label className="triage-option">
            <input
              type="radio"
              name="intensity"
              value="leve"
            />
            <span>Leve</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="intensity"
              value="moderada"
            />
            <span>Moderada</span>
          </label>

          <label className="triage-option">
            <input
              type="radio"
              name="intensity"
              value="intensa"
            />
            <span>Intensa</span>
          </label>
        </fieldset>

        <div className="triage-warning">
          <strong>Importante</strong>

          <p>
            Esta pré-triagem não substitui uma avaliação médica.
            Em situações de emergência, procure imediatamente um serviço
            de atendimento de urgência.
          </p>
        </div>

        <button
          type="button"
          className="primary-button triage-submit"
          onClick={onResultado}
        >
          Continuar
        </button>
      </form>
    </section>
  )
}

export default Triagem
