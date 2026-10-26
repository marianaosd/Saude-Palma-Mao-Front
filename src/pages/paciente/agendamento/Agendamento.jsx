import { useState } from 'react'
import { api } from '../../../services/api.js'
import './Agendamento.css'

function Agendamento({ onBack, onConfirmar, clinica, profissional, especialidade, slot, triagem }) {
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleConfirmar() {
    setErro('')
    setEnviando(true)

    try {
      const agendamento = await api('/agendamentos', {
        method: 'POST',
        body: JSON.stringify({
          id_profissional: profissional.id,
          id_clinica: clinica.id,
          id_triagem: triagem?.id,
          data_consulta: slot.data,
          horario_inicio: slot.horario_inicio,
          horario_fim: slot.horario_fim
        })
      })

      onConfirmar(agendamento)
    } catch (error) {
      setErro(error.message)
    } finally {
      setEnviando(false)
    }
  }

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

          <h2>{profissional?.nome || 'Profissional não selecionado'}</h2>

          <p>{especialidade || 'Atendimento'}</p>
        </div>

        <div className="booking-section">
          <span className="card-label">Local</span>

          <h2>{clinica?.nome || 'Clínica não selecionada'}</h2>

          <p>{clinica?.endereco}</p>
        </div>

        <div className="booking-section">
          <span className="card-label">Data e horário</span>

          <h2>{slot?.rotulo || 'Horário não selecionado'}</h2>

          <p>Atendimento clínico</p>
        </div>

        <div className="booking-warning">
          <strong>Antes de confirmar</strong>

          <p>
            Verifique se os dados da consulta estão corretos.
            O agendamento poderá ser consultado posteriormente na sua área do paciente.
          </p>
        </div>

        {erro && <p className="app-feedback error" role="alert">{erro}</p>}

        <button
          type="button"
          className="primary-button"
          onClick={handleConfirmar}
          disabled={enviando || !profissional || !clinica || !slot}
        >
          {enviando ? 'Confirmando...' : 'Confirmar agendamento'}
        </button>
      </div>
    </section>
  )
}

export default Agendamento
