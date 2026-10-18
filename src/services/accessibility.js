const STORAGE_KEY_SCALE = 'saude_font_scale'
const STORAGE_KEY_THEME = 'saude_theme'
const STORAGE_KEY_CONTRAST = 'saude_contrast'

// Escalas permitidas: 85%, 100% (padrão), 115%, 130%
export const FONT_SCALES = [
  { valor: 0.85, rotulo: 'Pequeno (-)' },
  { valor: 1.0, rotulo: 'Padrão (100%)' },
  { valor: 1.15, rotulo: 'Médio (+)' },
  { valor: 1.3, rotulo: 'Grande (++)' }
]

export function obterConfiguracoesAcessibilidade() {
  const escalaSalva = parseFloat(localStorage.getItem(STORAGE_KEY_SCALE))
  const temaSalvo = localStorage.getItem(STORAGE_KEY_THEME) === 'dislexia' ? 'dislexia' : 'padrao'
  const contrasteSalvo = localStorage.getItem(STORAGE_KEY_CONTRAST) || 'padrao'

  return {
    escala: !isNaN(escalaSalva) && escalaSalva >= 0.85 && escalaSalva <= 1.3 ? escalaSalva : 1.0,
    tema: temaSalvo,
    contraste: contrasteSalvo
  }
}

export function aplicarConfiguracoesAcessibilidade({ escala, tema, contraste }) {
  const root = document.documentElement

  // Aplica escala de fonte
  if (typeof escala === 'number') {
    root.style.setProperty('--font-scale', String(escala))
    localStorage.setItem(STORAGE_KEY_SCALE, String(escala))
  }

  // Aplica a fonte de leitura ('padrao' ou 'dislexia')
  if (tema) {
    if (tema === 'padrao') {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', tema)
    }
    localStorage.setItem(STORAGE_KEY_THEME, tema)
  }

  // Aplica alto contraste
  if (contraste) {
    if (contraste === 'padrao') {
      root.removeAttribute('data-contrast')
    } else {
      root.setAttribute('data-contrast', contraste)
    }
    localStorage.setItem(STORAGE_KEY_CONTRAST, contraste)
  }
}

export function restaurarAcessibilidadePadrao() {
  const padrao = { escala: 1.0, tema: 'padrao', contraste: 'padrao' }
  aplicarConfiguracoesAcessibilidade(padrao)
  return padrao
}
