import { useState, useEffect, useRef } from 'react'
import {
  obterConfiguracoesAcessibilidade,
  aplicarConfiguracoesAcessibilidade,
  restaurarAcessibilidadePadrao,
  FONT_SCALES
} from '../../services/accessibility.js'
import './AccessibilityPanel.css'
import simboloAcessibilidadeONU from '../../assets/icons/acessibilidade-onu.svg'

function AccessibilityPanel() {
  const [aberto, setAberto] = useState(false)
  const [config, setConfig] = useState(obterConfiguracoesAcessibilidade)
  const widgetRef = useRef(null)
  const triggerRef = useRef(null)

  useEffect(() => {
    aplicarConfiguracoesAcessibilidade(config)
  }, [config])

  // Com o painel aberto: fecha com Escape (devolvendo o foco ao botão) ou
  // com um clique fora dele. Sem isso, o painel só fechava pelo ✕.
  useEffect(() => {
    if (!aberto) return undefined

    function fecharComEscape(event) {
      if (event.key === 'Escape') {
        setAberto(false)
        triggerRef.current?.focus()
      }
    }

    function fecharAoClicarFora(event) {
      if (widgetRef.current && !widgetRef.current.contains(event.target)) {
        // Aqui o foco vai para onde a pessoa clicou, e não para o botão.
        setAberto(false)
      }
    }

    document.addEventListener('keydown', fecharComEscape)
    document.addEventListener('mousedown', fecharAoClicarFora)

    return () => {
      document.removeEventListener('keydown', fecharComEscape)
      document.removeEventListener('mousedown', fecharAoClicarFora)
    }
  }, [aberto])

  function ajustarEscala(direcao) {
    const currentIndex = FONT_SCALES.findIndex((item) => Math.abs(item.valor - config.escala) < 0.05)
    let nextIndex = currentIndex !== -1 ? currentIndex + direcao : 1 + direcao
    if (nextIndex < 0) nextIndex = 0
    if (nextIndex >= FONT_SCALES.length) nextIndex = FONT_SCALES.length - 1

    setConfig((prev) => ({ ...prev, escala: FONT_SCALES[nextIndex].valor }))
  }

  function alterarTema(novoTema) {
    setConfig((prev) => ({ ...prev, tema: novoTema }))
  }

  function alternarContraste() {
    setConfig((prev) => ({
      ...prev,
      contraste: prev.contraste === 'alto' ? 'padrao' : 'alto'
    }))
  }

  function handleRestaurar() {
    const padrao = restaurarAcessibilidadePadrao()
    setConfig(padrao)
  }

  return (
    <div className="a11y-widget" ref={widgetRef}>
      <button
        type="button"
        ref={triggerRef}
        className="a11y-trigger"
        aria-expanded={aberto}
        aria-controls="a11y-menu"
        aria-label="Opções de acessibilidade: tamanho do texto, fonte de leitura e contraste"
        onClick={() => setAberto((prev) => !prev)}
      >
        <img
          className="a11y-icon"
          src={simboloAcessibilidadeONU}
          alt=""
          aria-hidden="true"
        />
        <span className="a11y-trigger-text">Acessibilidade</span>
      </button>

      {aberto && (
        <section
          id="a11y-menu"
          className="a11y-panel"
          aria-label="Painel de preferências de acessibilidade"
        >
          <div className="a11y-header">
            <h2 className="a11y-title">Acessibilidade</h2>
            <button
              type="button"
              className="a11y-close-btn"
              aria-label="Fechar painel de acessibilidade"
              onClick={() => setAberto(false)}
            >
              ✕
            </button>
          </div>

          {/* Tamanho da Fonte */}
          <div className="a11y-section">
            <span className="a11y-label">Tamanho do texto</span>
            <div className="a11y-controls-row">
              <button
                type="button"
                className="a11y-btn"
                aria-label="Diminuir tamanho do texto"
                onClick={() => ajustarEscala(-1)}
                disabled={config.escala <= 0.85}
              >
                A−
              </button>
              <span className="a11y-scale-badge" aria-live="polite">
                {Math.round(config.escala * 100)}%
              </span>
              <button
                type="button"
                className="a11y-btn"
                aria-label="Aumentar tamanho do texto"
                onClick={() => ajustarEscala(1)}
                disabled={config.escala >= 1.3}
              >
                A+
              </button>
              <button
                type="button"
                className="a11y-btn a11y-btn--text"
                onClick={() => setConfig((prev) => ({ ...prev, escala: 1.0 }))}
                aria-label="Restaurar tamanho de texto padrão"
              >
                Padrão
              </button>
            </div>
          </div>

          {/* Fonte para dislexia */}
          <div className="a11y-section">
            <span className="a11y-label">Fonte de leitura</span>
            <div className="a11y-choice-group" role="radiogroup" aria-label="Fonte de leitura">
              <button
                type="button"
                role="radio"
                aria-checked={config.tema === 'padrao'}
                className={`a11y-choice-btn ${config.tema === 'padrao' ? 'a11y-choice-btn--active' : ''}`}
                onClick={() => alterarTema('padrao')}
              >
                ✓ Padrão
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={config.tema === 'dislexia'}
                className={`a11y-choice-btn ${config.tema === 'dislexia' ? 'a11y-choice-btn--active' : ''}`}
                onClick={() => alterarTema('dislexia')}
              >
                ✓ Fonte para dislexia
              </button>
            </div>
          </div>

          {/* Alto Contraste */}
          <div className="a11y-section">
            <span className="a11y-label">Contraste</span>
            <button
              type="button"
              className={`a11y-toggle-btn ${config.contraste === 'alto' ? 'a11y-toggle-btn--active' : ''}`}
              aria-pressed={config.contraste === 'alto'}
              onClick={alternarContraste}
            >
              {config.contraste === 'alto' ? '⬛ Alto Contraste Ativo' : '⬜ Ativar Alto Contraste'}
            </button>
          </div>

          {/* Restaurar Tudo */}
          <div className="a11y-footer">
            <button
              type="button"
              className="a11y-reset-btn"
              onClick={handleRestaurar}
            >
              Restaurar todas as opções
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default AccessibilityPanel
