// Dados fictícios do Figma. A data e as prioridades não são calculadas clinicamente.
export const professional = {
  name: 'Dr. Rafael Mendes',
  initials: 'RM',
  specialty: 'Clínico Geral',
  secondarySpecialty: 'Medicina da Família',
  registration: 'CRM 142.889',
  email: 'rafael.mendes@saude.com.br',
}

export const professionalClinics = [
  { id: 'saude-total-centro', name: 'Clínica Saúde Total — Centro', days: 'Seg, Qua e Sex' },
  { id: 'bem-estar-jardins', name: 'Unidade Bem-Estar — Jardins', days: 'Ter e Qui' },
]

export const appointmentDay = 'Segunda-feira, 22 de setembro'

export const professionalAppointments = [
  {
    id: 'marina-0830',
    time: '08:30',
    name: 'Marina Oliveira',
    initials: 'MO',
    symptoms: 'Febre alta e dor de cabeça',
    priority: 'urgent',
  },
  {
    id: 'carlos-1000',
    time: '10:00',
    name: 'Carlos Ferreira',
    initials: 'CF',
    symptoms: 'Dor no peito e falta de ar',
    priority: 'emergency',
  },
  {
    id: 'ana-1330',
    time: '13:30',
    name: 'Ana Beatriz Lima',
    initials: 'AL',
    symptoms: 'Dor de garganta persistente',
    priority: 'moderate',
  },
  // Quarto atendimento aparece na agenda do arquivo; a home mostra os três primeiros.
  {
    id: 'joao-1500',
    time: '15:00',
    name: 'João Pedro Santos',
    initials: 'JS',
    symptoms: 'Retorno e acompanhamento',
    priority: 'moderate',
  },
]

export const professionalHistory = [
  { id: 'history-marina', initials: 'MO', name: 'Marina Oliveira', detail: 'Consulta concluída', time: '08:30', date: '18 de setembro', isThisMonth: true, isReturn: false },
  { id: 'history-carlos', initials: 'CF', name: 'Carlos Ferreira', detail: 'Encaminhado à cardiologia', time: '10:00', date: '18 de setembro', isThisMonth: true, isReturn: false },
  { id: 'history-ana', initials: 'AL', name: 'Ana Beatriz Lima', detail: 'Orientação e prescrição', time: '13:30', date: '18 de setembro', isThisMonth: true, isReturn: false },
  { id: 'history-joao', initials: 'JS', name: 'João Pedro Santos', detail: 'Retorno em 30 dias', time: '15:00', date: '18 de setembro', isThisMonth: true, isReturn: true },
]
