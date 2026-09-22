import MovieCard from './MovieCard'

export default function Collections({ movies, saved, onToggleSave, onPlay, onSelectMovie }) {
  const collectionGroups = ['Sci-Fi', 'Drama', 'Action', 'Crime', 'Animation']
    .map((genre) => ({ genre, movies: movies.filter((movie) => movie.genre === genre) }))
    .filter((collection) => collection.movies.length > 0)

  return (
    <section className="content-section collections-page">
      <div className="page-heading">
        <span className="section-kicker">Your saved titles</span>
        <h1>Collections</h1>
        <p>Your watchlist, organized automatically by genre.</p>
      </div>
      <div className="collection-list">
        {collectionGroups.length > 0 ? collectionGroups.map((collection) => (
          <section className="collection-group" key={collection.genre}>
            <div className="section-heading"><div><span className="section-kicker">Collection</span><h2>{collection.genre}</h2></div><span className="collection-count">{collection.movies.length} {collection.movies.length === 1 ? 'title' : 'titles'}</span></div>
            <div className="movie-grid">{collection.movies.map((movie) => <MovieCard key={movie.id} movie={movie} isSaved={saved.includes(movie.id)} onToggleSave={onToggleSave} onPlay={onPlay} onSelect={onSelectMovie} />)}</div>
          </section>
        )) : <div className="empty-state">Your collections are empty. Add movies to your watchlist to organize them by genre.</div>}
      </div>
    </section>
  )
}
