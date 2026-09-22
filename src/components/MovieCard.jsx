import Icon from './Icon'

export default function MovieCard({ movie, isSaved, onToggleSave, onPlay, onSelect }) {
  return (
    <article className="movie-card" onClick={() => onSelect?.(movie)} onKeyDown={(event) => event.key === 'Enter' && onSelect?.(movie)} role={onSelect ? 'button' : undefined} tabIndex={onSelect ? 0 : undefined}>
      <div className="poster-wrap" style={{ '--accent': movie.accent }}>
        {movie.poster ? <img src={movie.poster} alt={`${movie.title} poster`} /> : <span className="poster-fallback">{movie.title}</span>}
        <button className={`save-button ${isSaved ? 'saved' : ''}`} onClick={(event) => { event.stopPropagation(); onToggleSave(movie) }} aria-label={isSaved ? `Remove ${movie.title} from watchlist` : `Add ${movie.title} to watchlist`}><Icon name="watchlist" size={14} /></button>
        <button className="poster-play" onClick={(event) => { event.stopPropagation(); onPlay(movie) }} aria-label={`Play ${movie.title}`}><Icon name="play" size={13} /></button>
      </div>
      <div className="movie-info"><div className="movie-title-row"><h3>{movie.title}</h3><span className="rating"><Icon name="star" size={10} />{movie.rating}</span></div><p>{movie.year} <i>•</i> {movie.genre} <i>•</i> {movie.duration}</p><button className="card-watchlist" onClick={(event) => { event.stopPropagation(); onToggleSave(movie) }}><Icon name={isSaved ? 'bookmark' : 'watchlist'} size={10} />{isSaved ? ' In watchlist' : ' Watchlist'}</button></div>
    </article>
  )
}
