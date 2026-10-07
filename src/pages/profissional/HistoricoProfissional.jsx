import { useMemo, useState } from 'react'
import ProfessionalLayout from '../../components/layout/ProfessionalLayout.jsx'
import ProfessionalIcon from '../../components/profissional/ProfessionalIcon.jsx'
import HistoryCard from '../../components/profissional/historicoProfissional/HistoryCard.jsx'
import HistoryDetailDialog from '../../components/profissional/historicoProfissional/HistoryDetailDialog.jsx'
import HistoryFilters from '../../components/profissional/historicoProfissional/HistoryFilters.jsx'
import { professionalHistory } from '../../data/profissional.js'
import './HistoricoProfissional.css'

function HistoricoProfissional() {
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedRecord, setSelectedRecord] = useState(null)

  const filteredRecords = useMemo(() => {
    const searchValue = search.trim().toLocaleLowerCase('pt-BR')

    return professionalHistory.filter((record) => {
      const matchesSearch = !searchValue
        || record.name.toLocaleLowerCase('pt-BR').includes(searchValue)
        || record.detail.toLocaleLowerCase('pt-BR').includes(searchValue)
      const matchesFilter = selectedFilter === 'all'
        || (selectedFilter === 'month' && record.isThisMonth)
        || (selectedFilter === 'returns' && record.isReturn)

      return matchesSearch && matchesFilter
    })
  }, [search, selectedFilter])

  const recordsByDate = filteredRecords.reduce((groups, record) => {
    const currentGroup = groups.find((group) => group.date === record.date)
    if (currentGroup) currentGroup.records.push(record)
    else groups.push({ date: record.date, records: [record] })
    return groups
  }, [])

  function navigate(destination) {
    if (destination === 'inicio') window.location.hash = '#profissional'
    else if (destination === 'agenda') window.location.hash = '#agenda-profissional'
    else if (destination === 'perfil') window.location.hash = '#perfil-profissional'
  }

  return (
    <ProfessionalLayout activePage="historico" onNavigate={navigate}>
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

        <main className="professional-history__main" id="professional-content" tabIndex={-1}>
          <HistoryFilters selectedFilter={selectedFilter} onChange={setSelectedFilter} />
          {recordsByDate.map((group) => (
            <section className="professional-history__group" key={group.date}>
              <h2>{group.date}</h2>
              <div className="professional-history__list">
                {group.records.map((record) => (
                  <HistoryCard key={record.id} record={record} onOpen={setSelectedRecord} />
                ))}
              </div>
            </section>
          ))}
          {filteredRecords.length === 0 && (
            <p className="professional-history__empty" role="status">
              Nenhum atendimento encontrado.
            </p>
          )}
        </main>
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
