const DIA_LABELS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function formatarDataISO(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function minutosParaHorario(minutos) {
  const horas = String(Math.floor(minutos / 60)).padStart(2, '0')
  const mins = String(minutos % 60).padStart(2, '0')
  return `${horas}:${mins}`
}

export function horarioParaMinutos(horario) {
  const [horas, minutos] = String(horario).slice(0, 8).split(':').map(Number)
  return horas * 60 + minutos
}

export function formatarHorario(horario) {
  return String(horario).slice(0, 5)
}

export function rotuloData(dataISO) {
  const [year, month, day] = dataISO.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  const hoje = formatarDataISO(new Date())
  const amanhaDate = new Date()
  amanhaDate.setDate(amanhaDate.getDate() + 1)
  const amanha = formatarDataISO(amanhaDate)

  if (dataISO === hoje) return 'Hoje'
  if (dataISO === amanha) return 'Amanhã'

  return `${DIA_LABELS[date.getDay()].slice(0, 3)} · ${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`
}

export function gerarHorarios(disponibilidades, idProfissional, dias = 10, ocupados = []) {
  const slots = []
  const agora = new Date()
  const hoje = new Date(agora)
  hoje.setHours(0, 0, 0, 0)
  const hojeISO = formatarDataISO(hoje)
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes()

  for (let offset = 0; offset < dias; offset += 1) {
    const date = new Date(hoje)
    date.setDate(hoje.getDate() + offset)
    const dataISO = formatarDataISO(date)
    const diaSemana = date.getDay()

    const janelas = disponibilidades.filter((item) => (
      item.id_profissional === idProfissional &&
      Number(item.dia_semana) === diaSemana
    ))

    const ocupadosDoDia = (ocupados || []).filter((item) => {
      // Normaliza 'YYYY-MM-DD'
      const dataItem = String(item.data || item.data_consulta || '').slice(0, 10)
      return dataItem === dataISO
    })

    for (const janela of janelas) {
      const inicio = horarioParaMinutos(janela.horario_inicio)
      const fim = horarioParaMinutos(janela.horario_fim)

      for (let minuto = inicio; minuto + 30 <= fim; minuto += 30) {
        // Se for hoje, não permite horários passados
        if (dataISO === hojeISO && minuto <= minutosAgora) {
          continue
        }

        const minutoFim = minuto + 30
        const horarioInicio = minutosParaHorario(minuto)
        const horarioFim = minutosParaHorario(minutoFim)

        // Verifica se colide com algum agendamento ocupado:
        // conflito quando: inicioOcupado < fimSlot && fimOcupado > inicioSlot
        const conflita = ocupadosDoDia.some((ocupado) => {
          const ocupadoInicio = horarioParaMinutos(ocupado.horario_inicio)
          const ocupadoFim = horarioParaMinutos(ocupado.horario_fim)
          return ocupadoInicio < minutoFim && ocupadoFim > minuto
        })

        if (!conflita) {
          slots.push({
            data: dataISO,
            horario_inicio: horarioInicio,
            horario_fim: horarioFim,
            rotulo: `${rotuloData(dataISO)} · ${formatarHorario(horarioInicio)}`
          })
        }
      }
    }
  }

  return slots
}

export function primeiroNome(nomeCompleto) {
  if (!nomeCompleto) return 'paciente'
  return nomeCompleto.trim().split(' ')[0]
}

export function humanizarAcao(acao) {
  if (!acao) return 'Orientação de atendimento'

  const mapa = {
    Continuar_Questionario: 'Continue o atendimento com uma consulta',
    Encaminhar_Presencial: 'Procure atendimento presencial',
    Encaminhar_Atendimento_Presencial_Urgente: 'Procure atendimento presencial com urgência',
    Agendamento_Telemedicina_Recomendado: 'Uma consulta pode ser agendada'
  }

  return mapa[acao] || acao.replaceAll('_', ' ')
}
