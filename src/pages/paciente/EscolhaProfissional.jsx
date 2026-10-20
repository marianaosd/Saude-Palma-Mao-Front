import { useEffect, useMemo, useState } from 'react'
import { api } from '../../services/api.js'
import { gerarHorarios } from '../../services/agenda.js'
import './EscolhaProfissional.css'

function EscolhaProfissional({ onBack, onAgendar, clinica }) {
  const [profissionais, setProfissionais] = useState([])
  const [especialidades, setEspecialidades] = useState([])
  const [disponibilidades, setDisponibilidades] = useState([])
  const [ocupadosPorProfissional, setOcupadosPorProfissional] = useState({})
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [listaProfissionais, listaEspecialidades, listaDisponibilidades] = await Promise.all([
          api('/profissionais'),
          api('/especialidades'),
          api('/disponibilidades')
        ])

        if (!ativo) return

        const profissionaisFiltrados = listaProfissionais.filter((item) => (
          item.status !== false &&
          (!clinica?.id || item.id_clinica === clinica.id)
        ))

        setProfissionais(profissionaisFiltrados)
        setEspecialidades(listaEspecialidades)
        setDisponibilidades(listaDisponibilidades)

        // Busca horários ocupados para os profissionais exibidos em paralelo
        if (profissionaisFiltrados.length > 0) {
          const ocupadosEntries = await Promise.all(
            profissionaisFiltrados.map(async (prof) => {
              try {
                const dados = await api(`/profissionais/${prof.id}/horarios-ocupados`)
                return [prof.id, dados]
              } catch {
                return [prof.id, []]
              }
            })
          )

          if (ativo) {
            setOcupadosPorProfissional(Object.fromEntries(ocupadosEntries))
          }
        }
      } catch (error) {
        if (ativo) setErro(error.message)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [clinica])

  const especialidadePorId = useMemo(() => {
    return Object.fromEntries(especialidades.map((item) => [item.id, item.nome]))
  }, [especialidades])

  return (
    <section className="professional-selection-page" aria-labelledby="professional-selection-title">
      <div className="professional-selection-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Profissional de saúde</p>

        <h1 id="professional-selection-title">
          Escolha um profissional
        </h1>

        <p>
          Selecione o profissional e um horário disponível para sua consulta
          {clinica?.nome ? ` em ${clinica.nome}` : ''}.
        </p>
      </div>

      {erro && <p className="app-feedback error" role="alert">{erro}</p>}
      {carregando && <p className="app-empty">Carregando profissionais...</p>}

      {!carregando && profissionais.length === 0 && (
        <p className="app-empty">
          Não há profissionais cadastrados para esta clínica.
        </p>
      )}

      {profissionais.map((profissional) => {
        const especialidade = especialidadePorId[profissional.id_especialidade] || 'Atendimento'
        const ocupados = ocupadosPorProfissional[profissional.id] || []
        const horarios = gerarHorarios(disponibilidades, profissional.id, 10, ocupados)

        return (
          <article className="professional-selection-card" key={profissional.id}>
            <div className="professional-selection-info">
              <span className="card-label">{especialidade}</span>

              <h2>{profissional.nome}</h2>

              <p>{clinica?.nome}</p>

              <span className="professional-selection-details">
                {profissional.conselho} {profissional.registro_conselho}
              </span>
            </div>

            <div className="schedule">
              <h3>Horários disponíveis</h3>

              {horarios.length === 0 ? (
                <p className="app-empty">Sem horários cadastrados para os próximos dias.</p>
              ) : (
                <div className="schedule-grid">
                  {horarios.slice(0, 8).map((slot) => (
                    <button
                      type="button"
                      className="schedule-option"
                      key={`${profissional.id}-${slot.data}-${slot.horario_inicio}`}
                      onClick={() => onAgendar({ profissional, especialidade, slot })}
                    >
                      {slot.rotulo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </article>
        )
      })}
    </section>
  )
}

export default EscolhaProfissional
