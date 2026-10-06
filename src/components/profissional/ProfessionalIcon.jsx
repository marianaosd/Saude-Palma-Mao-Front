import bell from '../../assets/icons/profissional/bell.svg'
import calendarSummary from '../../assets/icons/profissional/calendar-summary.svg'
import chevronRight from '../../assets/icons/profissional/chevron-right.svg'
import calendarAction from '../../assets/icons/profissional/calendar-action.svg'
import settings from '../../assets/icons/profissional/settings.svg'
import historyAction from '../../assets/icons/profissional/history-action.svg'
import homeActive from '../../assets/icons/profissional/home-active.svg'
import calendarNav from '../../assets/icons/profissional/calendar-nav.svg'
import historyNav from '../../assets/icons/profissional/history-nav.svg'
import profileNav from '../../assets/icons/profissional/profile-nav.svg'
import agendaSettings from '../../assets/icons/profissional/agenda-settings-white.svg'
import agendaSlotPlus from '../../assets/icons/profissional/agenda-slot-plus.svg'
import agendaHomeNav from '../../assets/icons/profissional/agenda-home-nav.svg'
import agendaCalendarNav from '../../assets/icons/profissional/agenda-calendar-nav.svg'
import agendaHistoryNav from '../../assets/icons/profissional/agenda-history-nav.svg'
import agendaProfileNav from '../../assets/icons/profissional/agenda-profile-nav.svg'
import historySearch from '../../assets/icons/profissional/history-search.svg'
import historyCheck from '../../assets/icons/profissional/history-check.svg'
import historyChevron from '../../assets/icons/profissional/history-chevron-right.svg'
import historyHomeNav from '../../assets/icons/profissional/history-home-nav.svg'
import historyAgendaNav from '../../assets/icons/profissional/history-agenda-nav.svg'
import historyActiveNav from '../../assets/icons/profissional/history-active-nav.svg'
import historyProfileNav from '../../assets/icons/profissional/history-profile-nav.svg'
import './ProfessionalIcon.css'

const icons = {
  bell,
  calendarSummary,
  chevronRight,
  calendarAction,
  settings,
  historyAction,
  homeActive,
  calendarNav,
  historyNav,
  profileNav,
  agendaSettings,
  agendaSlotPlus,
  agendaHomeNav,
  agendaCalendarNav,
  agendaHistoryNav,
  agendaProfileNav,
  historySearch,
  historyCheck,
  historyChevron,
  historyHomeNav,
  historyAgendaNav,
  historyActiveNav,
  historyProfileNav,
}

function ProfessionalIcon({ name }) {
  // Os SVGs mantêm as dimensões e cores originais exportadas do Figma.
  return <img className="professional-icon" src={icons[name]} alt="" aria-hidden="true" />
}

export default ProfessionalIcon
