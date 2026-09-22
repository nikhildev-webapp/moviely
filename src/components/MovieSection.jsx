import MovieCard from './MovieCard'
import { genres } from '../data/movies'

export default function MovieSection({ movies, query, activeGenre, onGenreChange, isSearching, error, saved, onToggleSave, onPlay, onSelectMovie, title, showFilters = true }) {
  const isSearch = query.trim().length >= 2
  const safeError = typeof error === 'string' ? error : 'Unable to load movie results.'
  return (
    <section className="content-section">
      <div className="section-heading"><div><span className="section-kicker">{isSearch ? 'IMDb search' : title || 'IMDb charts'}</span><h2>{isSearch ? `Results for “${query.trim()}”` : title || 'Top picks for you'}</h2></div></div>
      {!isSearch && showFilters && <div className="filter-row">{genres.map((genre) => <button key={genre} className={activeGenre === genre ? 'selected' : ''} onClick={() => onGenreChange(genre)}>{genre}</button>)}</div>}
      {isSearching ? <div className="empty-state">Searching for “{query.trim()}”...</div> : error ? <div className="empty-state">{safeError}</div> : movies.length > 0 ? <div className="movie-grid">{movies.map((movie) => <MovieCard key={movie.id} movie={movie} isSaved={saved.includes(movie.id)} onToggleSave={onToggleSave} onPlay={onPlay} onSelect={onSelectMovie} />)}</div> : <div className="empty-state">No movies found. Try another search.</div>}
    </section>
  )
}
