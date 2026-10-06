import { professionalAppointments } from './profissional.js'

const mondayAppointments = professionalAppointments.map((appointment) => ({
  ...appointment,
  symptoms: appointment.symptoms,
}))

const tuesdayAppointments = [
  { id: 'marina-0900', time: '09:00', name: 'Marina Oliveira', symptoms: 'Consulta presencial' },
  { id: 'carlos-1130', time: '11:30', name: 'Carlos Ferreira', symptoms: 'Consulta presencial' },
  { id: 'ana-1400', time: '14:00', name: 'Ana Beatriz Lima', symptoms: 'Consulta presencial' },
]

export const agendaMonth = 'Setembro 2026'

export const agendaDays = [
  {
    id: '2026-09-22',
    weekday: 'SEG',
    weekdayName: 'Segunda-feira',
    date: 22,
    appointments: mondayAppointments,
    availableCount: 2,
    availableSlots: ['16:30'],
  },
  {
    id: '2026-09-23',
    weekday: 'TER',
    weekdayName: 'Terça-feira',
    date: 23,
    appointments: tuesdayAppointments,
    availableCount: 3,
    availableSlots: ['16:30'],
  },
  { id: '2026-09-24', weekday: 'QUA', weekdayName: 'Quarta-feira', date: 24, appointments: [], availableCount: 0, availableSlots: [] },
  { id: '2026-09-25', weekday: 'QUI', weekdayName: 'Quinta-feira', date: 25, appointments: [], availableCount: 0, availableSlots: [] },
  { id: '2026-09-26', weekday: 'SEX', weekdayName: 'Sexta-feira', date: 26, appointments: [], availableCount: 0, availableSlots: [] },
]
