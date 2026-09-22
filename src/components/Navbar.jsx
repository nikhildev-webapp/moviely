import Icon from './Icon'
import { navItems } from '../data/movies'

export default function Navbar({ activeNav, onNavigate, savedCount, query, onQueryChange }) {
  return (
    <header className="navbar">
      <div className="brand"><span className="brand-mark">imdb</span><span className="brand-name">moviely</span></div>
      <nav className="navbar-links" aria-label="Primary navigation">
        {navItems.map(([icon, label]) => (
          <button key={label} className={activeNav === label ? 'active' : ''} onClick={() => onNavigate(label)}>
            <Icon name={icon} size={14} /><span>{label}</span>{label === 'Watchlist' && <span className="count">{savedCount}</span>}
          </button>
        ))}
      </nav>
      <label className="search-box navbar-search"><Icon name="search" size={14} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search movies, shows, people..." aria-label="Search movies" /></label>
      <div className="profile"><div className="avatar">NS</div><div><strong>Nikhil S.</strong><span>Free account</span></div></div>
    </header>
  )
}
