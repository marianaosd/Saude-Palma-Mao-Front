/* Service worker do Desafila.
 *
 * Objetivo: permitir instalar o app e abrir mais rápido, guardando o "casco"
 * (HTML, CSS, JS, fontes e ícones) no cache do navegador.
 *
 * REGRA DE OURO: nada de /api é cacheado. Dados de pacientes, consultas e
 * pré-triagem têm de vir sempre do servidor — cachear isso mostraria
 * informação velha (ou pior, de outra pessoa).
 *
 * Estratégias usadas:
 * - Navegação (abrir uma página): rede primeiro; se estiver offline, usa a
 *   última versão guardada do index.
 * - Arquivos estáticos com hash no nome: cache primeiro (nunca mudam).
 * - /api e demais requisições: passam direto, sem cache.
 */

const VERSAO = 'desafila-v1'
const CACHE_ESTATICOS = `${VERSAO}-estaticos`
const CACHE_PAGINA = `${VERSAO}-paginas`

// O mínimo para o app abrir offline.
const ARQUIVOS_INICIAIS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/favicon.svg',
  '/icone-192.png',
  '/icone-512.png',
  '/apple-touch-icon.png'
]

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches
      .open(CACHE_PAGINA)
      .then((cache) => cache.addAll(ARQUIVOS_INICIAIS))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((chaves) =>
        Promise.all(
          chaves
            .filter((chave) => !chave.startsWith(VERSAO))
            .map((chave) => caches.delete(chave))
        )
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (evento) => {
  const { request } = evento

  // Só mexemos com GET. POST/PUT/PATCH/DELETE nunca passam por cache.
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  // 1) API: sempre rede, nunca cache.
  if (url.pathname.startsWith('/api')) return

  // 2) Outros domínios (fontes externas, CDNs): não intercepta.
  if (url.origin !== self.location.origin) return

  // 3) Abrir página: rede primeiro, cache só como reserva offline.
  if (request.mode === 'navigate') {
    evento.respondWith(
      fetch(request)
        .then((resposta) => {
          const copia = resposta.clone()
          caches.open(CACHE_PAGINA).then((cache) => cache.put('/index.html', copia))
          return resposta
        })
        .catch(() => caches.match('/index.html'))
    )
    return
  }

  // 4) Arquivos estáticos (JS, CSS, fontes, imagens): cache primeiro.
  evento.respondWith(
    caches.match(request).then((emCache) => {
      if (emCache) return emCache

      return fetch(request).then((resposta) => {
        // Só guarda respostas boas e do próprio site.
        if (resposta.ok && resposta.type === 'basic') {
          const copia = resposta.clone()
          caches.open(CACHE_ESTATICOS).then((cache) => cache.put(request, copia))
        }
        return resposta
      })
    })
  )
})
