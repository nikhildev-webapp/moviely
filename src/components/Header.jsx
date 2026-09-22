import Icon from './Icon'

export default function Header({ query, onQueryChange, onMenuToggle }) {
  return (
    <header className="topbar">
      <button className="menu-button" onClick={onMenuToggle} aria-label="Toggle navigation"><Icon name="menu" size={16} /></button><div className="mobile-brand"><span className="brand-mark">imdb</span>moviely</div>
      <div className="welcome"><span className="greeting">THE WORLD'S MOST POPULAR MOVIE DATABASE</span><strong>What will you watch next?</strong></div>
      <label className="search-box"><Icon name="search" size={14} /><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Search movies, shows, people..." aria-label="Search movies" /></label>
      <div className="top-actions"><div className="mini-avatar">NS</div></div>
    </header>
  )
}
