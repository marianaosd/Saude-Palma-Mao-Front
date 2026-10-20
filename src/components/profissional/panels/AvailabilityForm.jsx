import { useEffect, useState } from 'react'
import { api } from '../../../services/api.js'

// Fatia 'HH:MM:SS' para 'HH:MM'; já aceita 'HH:MM'.
function fatiarhora(h) {
  return String(h || '').slice(0, 5)
}

// Deriva o draft inicial (start, end) a partir das janelas existentes de seg–sex.
// Usa o par (início, fim) mais frequente; se não houver nenhum, '08:00'–'17:00'.
function derivarDraft(janelas) {
  const segSex = janelas.filter((j) => j.dia_semana >= 1 && j.dia_semana <= 5)
  if (segSex.length === 0) return { start: '08:00', end: '17:00' }

  // Conta a frequência de cada par start–end
  const contagem = {}
  for (const j of segSex) {
    const chave = `${fatiarhora(j.horario_inicio)}|${fatiarhora(j.horario_fim)}`
    contagem[chave] = (contagem[chave] || 0) + 1
  }
  const parMaisFrequente = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0][0]
  const [start, end] = parMaisFrequente.split('|')
  return { start, end }
}

function AvailabilityForm() {
  const [janelas, setJanelas]     = useState([])
  const [draft, setDraft]         = useState({ start: '08:00', end: '17:00' })
  const [carregando, setCarregando] = useState(true)
  const [erroCarga, setErroCarga]   = useState('')
  const [salvando, setSalvando]     = useState(false)
  const [erroForm, setErroForm]     = useState('')
  const [saved, setSaved]           = useState(false)

  // Carrega as disponibilidades do profissional ao montar.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErroCarga('')
      try {
        const dados = await api('/disponibilidades/me')
        if (cancelado) return
        const lista = Array.isArray(dados) ? dados : []
        setJanelas(lista)
        setDraft(derivarDraft(lista))
      } catch (e) {
        if (!cancelado) setErroCarga(e.message || 'Não foi possível carregar os horários.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => { cancelado = true }
  }, [])

  function changeTime(event) {
    event.currentTarget.setCustomValidity('')
    setDraft({ ...draft, [event.currentTarget.name]: event.currentTarget.value })
    setSaved(false)
  }

  // Sincroniza os dias 1–5 com a janela única representada pelo formulário.
  // O formulário representa UMA janela seg–sex; o salvamento garante que cada
  // dia 1–5 tenha exatamente uma disponibilidade com o horário do draft,
  // removendo duplicatas e atualizando entradas divergentes.
  async function submit(event) {
    event.preventDefault()
    setSaved(false)
    setErroForm('')

    if (draft.start >= draft.end) {
      event.currentTarget.elements.end.setCustomValidity(
        'O horário de término deve ser posterior ao início.'
      )
      event.currentTarget.reportValidity()
      return
    }

    setSalvando(true)

    // Função auxiliar para recarregar a lista após sucesso ou erro.
    async function recarregar() {
      try {
        const dados = await api('/disponibilidades/me')
        setJanelas(Array.isArray(dados) ? dados : [])
      } catch {
        // best-effort: ignora falha no recarregamento
      }
    }

    try {
      // Fase 1 — remover duplicatas: para cada dia 1–5 com mais de uma janela,
      // apaga todas exceto a primeira (sequencial, um DELETE por vez).
      for (let dia = 1; dia <= 5; dia++) {
        const dodia = janelas.filter((j) => j.dia_semana === dia)
        for (const extra of dodia.slice(1)) {
          await api(`/disponibilidades/${extra.id}`, { method: 'DELETE' })
        }
      }

      // Fase 2 — sincronizar: POST se não existia, PUT se o horário difere,
      // nada se já está igual. Nunca toca em dia 0 ou 6.
      for (let dia = 1; dia <= 5; dia++) {
        const dodia = janelas.filter((j) => j.dia_semana === dia)
        const janela = dodia[0]   // pode ser undefined após fase 1
        const corpo = {
          dia_semana:     dia,
          horario_inicio: draft.start,
          horario_fim:    draft.end,
        }

        if (!janela) {
          await api('/disponibilidades', { method: 'POST', body: JSON.stringify(corpo) })
        } else if (
          fatiarhora(janela.horario_inicio) !== draft.start ||
          fatiarhora(janela.horario_fim)    !== draft.end
        ) {
          await api(`/disponibilidades/${janela.id}`, {
            method: 'PUT',
            body: JSON.stringify(corpo),
          })
        }
        // Igual: não faz nada
      }

      await recarregar()
      setSaved(true)
    } catch (e) {
      setErroForm(e.message || 'Não foi possível salvar os horários.')
      await recarregar()
    } finally {
      setSalvando(false)
    }
  }

  // Estado de carregamento
  if (carregando) {
    return (
      <p className="professional-panel__empty" role="status" aria-live="polite">
        Carregando horários…
      </p>
    )
  }

  // Erro de carga: não exibe o formulário para evitar salvar às cegas
  if (erroCarga) {
    return (
      <p className="professional-panel__empty" role="alert">
        {erroCarga}
      </p>
    )
  }

  return (
    <form className="professional-panel__form" onSubmit={submit}>
      <p className="professional-panel__description">Segunda a sexta-feira</p>
      <label className="professional-panel__field">
        Início do atendimento
        <input name="start" type="time" value={draft.start} onChange={changeTime} required />
      </label>
      <label className="professional-panel__field">
        Fim do atendimento
        <input name="end" type="time" value={draft.end} onChange={changeTime} required />
      </label>
      {saved && (
        <p className="professional-panel__saved" role="status">
          Horários atualizados para {draft.start}–{draft.end}.
        </p>
      )}
      {erroForm && (
        <p className="professional-panel__empty" role="alert">
          {erroForm}
        </p>
      )}
      <button
        className="professional-panel__submit"
        type="submit"
        disabled={salvando}
      >
        {salvando ? 'Salvando…' : 'Salvar horários'}
      </button>
    </form>
  )
}

export default AvailabilityForm
