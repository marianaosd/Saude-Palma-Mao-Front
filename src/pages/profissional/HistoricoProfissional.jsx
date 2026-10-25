import { useEffect, useMemo, useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import HistoryCard from '../../components/profissional/historicoProfissional/HistoryCard.jsx'
import HistoryDetailDialog from '../../components/profissional/historicoProfissional/HistoryDetailDialog.jsx'
import HistoryFilters from '../../components/profissional/historicoProfissional/HistoryFilters.jsx'
import { api } from '../../services/api.js'
import './HistoricoProfissional.css'

// ─── helpers ─────────────────────────────────────────────────────────────────

const MESES = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro',
]

// Calcula as iniciais de um nome completo (até 2 letras).
function calcularIniciais(nomeCompleto) {
  const partes = String(nomeCompleto || '').trim().split(/\s+/).filter(Boolean)
  if (partes.length === 0) return '?'
  if (partes.length === 1) return partes[0][0].toUpperCase()
  return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase()
}

// Retorna a data local de hoje como 'YYYY-MM-DD'.
function dataHojeStr() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// Converte 'YYYY-MM-DD' em rótulo legível: 'D de mês' ou 'D de mês de AAAA'.
// O ano é incluído apenas quando diferente do ano corrente.
function rotuloData(dateISO) {
  const [anoStr, mesStr, diaStr] = dateISO.split('-')
  const ano = Number(anoStr)
  const mes = Number(mesStr) - 1
  const dia = Number(diaStr)
  const anoAtual = new Date().getFullYear()
  const sufixoAno = ano !== anoAtual ? ` de ${ano}` : ''
  return `${dia} de ${MESES[mes]}${sufixoAno}`
}

// Mapeia o status do banco para o rótulo feminino (consulta).
function statusLabel(status) {
  if (status === 'Agendado')  return 'Agendada'
  if (status === 'Concluido') return 'Concluída'
  if (status === 'Cancelado') return 'Cancelada'
  return status
}

// ─── componente principal ─────────────────────────────────────────────────────

function HistoricoProfissional({ onLogout }) {
  const [agendamentos, setAgendamentos] = useState([])
  const [carregando, setCarregando]     = useState(true)
  const [erro, setErro]                 = useState('')
  const [search, setSearch]             = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Carrega os agendamentos uma única vez ao montar.
  useEffect(() => {
    let cancelado = false

    async function carregar() {
      setCarregando(true)
      setErro('')
      try {
        const dados = await api('/profissionais/me/agendamentos')
        if (cancelado) return
        setAgendamentos(Array.isArray(dados) ? dados : [])
      } catch (e) {
        if (!cancelado) setErro(e.message || 'Não foi possível carregar o histórico.')
      } finally {
        if (!cancelado) setCarregando(false)
      }
    }

    carregar()
    return () => { cancelado = true }
  }, [])

  const hoje = useMemo(() => dataHojeStr(), [])
  const [anoHoje, mesHoje] = hoje.split('-').map(Number)

  // Histórico: consultas com data anterior a hoje, ordenadas da mais recente para a mais antiga.
  const historico = useMemo(() => {
    return agendamentos
      .filter((a) => a.data_consulta < hoje)
      .sort((a, b) => {
        const porData = b.data_consulta.localeCompare(a.data_consulta)
        return porData !== 0 ? porData : b.horario_inicio.localeCompare(a.horario_inicio)
      })
      .map((a) => {
        const [anoConsulta, mesConsulta] = a.data_consulta.split('-').map(Number)
        return {
          id:          a.id,
          dateISO:     a.data_consulta,
          name:        a.paciente,
          initials:    calcularIniciais(a.paciente),
          detail:      a.clinica,
          time:        String(a.horario_inicio || '').slice(0, 5),
          date:        rotuloData(a.data_consulta),
          status:      a.status,
          statusLabel: statusLabel(a.status),
          isThisMonth: anoConsulta === anoHoje && mesConsulta === mesHoje,
          id_triagem:  a.id_triagem,
        }
      })
  }, [agendamentos, hoje, anoHoje, mesHoje])

  // Filtragem e busca aplicadas sobre o histórico mapeado.
  const filteredRecords = useMemo(() => {
    const termo = search.trim().toLocaleLowerCase('pt-BR')

    return historico.filter((record) => {
      const matchesSearch = !termo
        || record.name.toLocaleLowerCase('pt-BR').includes(termo)
        || record.detail.toLocaleLowerCase('pt-BR').includes(termo)

      const matchesFilter =
        selectedFilter === 'all'
        || (selectedFilter === 'month'     && record.isThisMonth)
        || (selectedFilter === 'completed' && record.status === 'Concluido')

      return matchesSearch && matchesFilter
    })
  }, [historico, search, selectedFilter])

  // Agrupa por dateISO (chave estável); exibe record.date como título do grupo.
  const recordsByDate = useMemo(() => {
    return filteredRecords.reduce((groups, record) => {
      const grupo = groups.find((g) => g.dateISO === record.dateISO)
      if (grupo) grupo.records.push(record)
      else groups.push({ dateISO: record.dateISO, date: record.date, records: [record] })
      return groups
    }, [])
  }, [filteredRecords])

  function navigate(destination) {
    if (destination === 'inicio')    window.location.hash = '#profissional'
    else if (destination === 'agenda') window.location.hash = '#agenda-profissional'
    else if (destination === 'perfil') window.location.hash = '#perfil-profissional'
  }

  return (
    <ProfessionalLayout activePage="historico" onNavigate={navigate} onLogout={onLogout}>
      <div className="professional-history">
        <header className="professional-history__header">
          <h1>Histórico</h1>
          <label className="professional-history__search">
            <span className="professional-history__search-icon" aria-hidden="true">
              <ProfessionalIcon name="historySearch" />
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.currentTarget.value)}
              placeholder="Buscar paciente"
              aria-label="Buscar paciente no histórico"
            />
          </label>
        </header>

        <div className="professional-history__main">
          <HistoryFilters selectedFilter={selectedFilter} onChange={setSelectedFilter} />

          {/* Estados de carregamento e erro */}
          {carregando && (
            <p className="professional-history__empty" role="status" aria-live="polite">
              Carregando histórico…
            </p>
          )}
          {!carregando && erro && (
            <p className="professional-history__empty" role="alert">
              {erro}
            </p>
          )}

          {/* Lista agrupada por data */}
          {!carregando && !erro && recordsByDate.map((group) => (
            <section className="professional-history__group" key={group.dateISO}>
              <h2>{group.date}</h2>
              <div className="professional-history__list">
                {group.records.map((record) => (
                  <HistoryCard key={record.id} record={record} onOpen={setSelectedRecord} />
                ))}
              </div>
            </section>
          ))}

          {/* Sem resultados */}
          {!carregando && !erro && filteredRecords.length === 0 && (
            <p className="professional-history__empty" role="status">
              Nenhum atendimento encontrado.
            </p>
          )}
        </div>
      </div>

      {selectedRecord && (
        <HistoryDetailDialog
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </ProfessionalLayout>
  )
}

export default HistoricoProfissional
