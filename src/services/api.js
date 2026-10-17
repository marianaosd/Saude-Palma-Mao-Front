const API_BASE = '/api'

// Chaves do paciente
const TOKEN_KEY = 'saude_token'
const USER_KEY = 'saude_paciente'

// Chaves do profissional — separadas para não colidir com a sessão do paciente
const PROF_TOKEN_KEY = 'saude_profissional_token'
const PROF_USER_KEY = 'saude_profissional'

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getUsuario() {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function salvarSessao(token, paciente) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(paciente))
}

export function limparSessao() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

// ─── Sessão do profissional ───────────────────────────────────────────────────

export function getProfissionalToken() {
  return localStorage.getItem(PROF_TOKEN_KEY)
}

export function getProfissional() {
  const raw = localStorage.getItem(PROF_USER_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function salvarSessaoProfissional(token, profissional) {
  localStorage.setItem(PROF_TOKEN_KEY, token)
  localStorage.setItem(PROF_USER_KEY, JSON.stringify(profissional))
}

export function limparSessaoProfissional() {
  localStorage.removeItem(PROF_TOKEN_KEY)
  localStorage.removeItem(PROF_USER_KEY)
}

export async function api(path, options = {}) {
  const headers = new Headers(options.headers || {})

  // Rotas do portal profissional usam o token do profissional;
  // todas as demais usam o token do paciente.
  const isProfissionalRoute =
    path.startsWith('/profissionais/me') ||
    path.startsWith('/auth/profissional/')
  const token = isProfissionalRoute ? getProfissionalToken() : getToken()

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => ({}))

  // Sessão expirada ou antiga: limpa o login e avisa o App para voltar à tela de entrada.
  if (response.status === 401 && token && !path.startsWith('/auth/')) {
    if (isProfissionalRoute) {
      limparSessaoProfissional()
      window.dispatchEvent(new Event('sessao-profissional-expirada'))
    } else {
      limparSessao()
      window.dispatchEvent(new Event('sessao-expirada'))
    }
  }

  if (!response.ok) {
    throw new Error(data.error || 'Não foi possível concluir a solicitação.')
  }

  return data
}
