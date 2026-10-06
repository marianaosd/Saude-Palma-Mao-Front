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
}

function ProfessionalIcon({ name }) {
  // Os SVGs mantêm as dimensões e cores originais exportadas do Figma.
  return <img className="professional-icon" src={icons[name]} alt="" aria-hidden="true" />
}

export default ProfessionalIcon
