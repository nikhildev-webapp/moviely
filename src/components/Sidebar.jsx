import Icon from './Icon'
import { navItems } from '../data/movies'

export default function Sidebar({ activeNav, onNavigate, savedCount, isOpen, isCollapsed, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''} ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="brand"><span className="brand-mark">imdb</span><span className="brand-name">moviely</span><button className="collapse-button" onClick={onToggle} aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}><Icon name={isCollapsed ? 'next' : 'previous'} size={11} /></button></div>
      <div className="side-section">
        <span className="side-label">Workspace</span>
        <nav>
          {navItems.map(([icon, label]) => (
            <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => onNavigate(label)}>
              <Icon name={icon} size={15} /><span className="nav-label">{label}</span>{label === 'Watchlist' && <span className="count">{savedCount}</span>}
            </button>
          ))}
        </nav>
      </div>
      <div className="sidebar-bottom">
        <div className="profile"><div className="avatar">NS</div><div><strong>Nikhil S.</strong><span>Free account</span></div><span className="more">•••</span></div>
      </div>
    </aside>
  )
}
