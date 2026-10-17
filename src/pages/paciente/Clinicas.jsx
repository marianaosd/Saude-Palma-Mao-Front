import { useEffect, useState } from 'react'
import { api } from '../../services/api.js'
import './Clinicas.css'

function Clinicas({ onBack, onSelecionar }) {
  const [clinicas, setClinicas] = useState([])
  const [erro, setErro] = useState('')
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const dados = await api('/clinicas')
        if (ativo) {
          setClinicas(dados.filter((clinica) => clinica.status !== false))
        }
      } catch (error) {
        if (ativo) setErro(error.message)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => { ativo = false }
  }, [])

  return (
    <section className="clinics-page" aria-labelledby="clinics-title">
      <div className="clinics-header">
        <button
          type="button"
          className="back-home-button"
          onClick={onBack}
        >
          ← Voltar
        </button>

        <p className="eyebrow">Clínicas</p>

        <h1 id="clinics-title">
          Escolha onde deseja ser atendido
        </h1>

        <p>
          Encontre uma unidade de atendimento e escolha o profissional
          disponível para sua consulta.
        </p>
      </div>

      {erro && <p className="app-feedback error" role="alert">{erro}</p>}

      {carregando && <p className="app-empty">Carregando clínicas...</p>}

      {!carregando && clinicas.length === 0 && (
        <p className="app-empty">
          Nenhuma clínica cadastrada no momento. Peça para a equipe incluir
          unidades no backend para continuar o agendamento.
        </p>
      )}

      <div className="clinics-list">
        {clinicas.map((clinica) => (
          <article className="clinic-card" key={clinica.id}>
            <div>
              <span className="card-label">Clínica</span>

              <h2>{clinica.nome}</h2>

              <p>{clinica.endereco}</p>

              <span className="clinic-info">
                {clinica.horario_funcionamento || clinica.telefone || 'Atendimento disponível'}
              </span>
            </div>

            <button
              type="button"
              className="primary-button"
              onClick={() => onSelecionar(clinica)}
            >
              Ver profissionais
            </button>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Clinicas
