import { useEffect, useState } from 'react'
import MovieCard from './MovieCard'
import Icon from './Icon'

const apiUrl = import.meta.env.VITE_API_KEY

export default function MovieDetails({ movie, saved, onToggleSave, onPlay, onBack }) {
  const [details, setDetails] = useState(movie)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    const loadDetails = async () => {
      if (!apiUrl) {
        setIsLoading(false)
        setError('Movie details are not configured. Add VITE_API_KEY to your .env file.')
        return
      }

      try {
        const url = new URL(apiUrl)
        url.searchParams.delete('s')
        url.searchParams.set('plot', 'full')
        if (movie.id && typeof movie.id === 'string') url.searchParams.set('i', movie.id)
        else url.searchParams.set('t', movie.title)

        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error('The movie service is unavailable.')
        const data = await response.json()
        if (data.Response === 'False') throw new Error(data.Error || 'Unable to load movie details.')

        setDetails({
          ...movie,
          id: data.imdbID || movie.id,
          title: data.Title || movie.title,
          year: data.Year?.slice(0, 4) || movie.year,
          genre: data.Genre || movie.genre,
          rating: data.imdbRating && data.imdbRating !== 'N/A' ? data.imdbRating : movie.rating,
          duration: data.Runtime && data.Runtime !== 'N/A' ? data.Runtime : movie.duration,
          poster: data.Poster && data.Poster !== 'N/A' ? data.Poster : movie.poster,
          certificate: data.Rated && data.Rated !== 'N/A' ? data.Rated : movie.certificate,
          description: data.Plot && data.Plot !== 'N/A' ? data.Plot : movie.description,
          director: data.Director,
          actors: data.Actors,
          writers: data.Writer,
          awards: data.Awards,
          ratings: data.Ratings || [],
          boxOffice: data.BoxOffice,
          language: data.Language,
          country: data.Country,
        })
      } catch (loadError) {
        if (loadError.name !== 'AbortError') setError(loadError.message || 'Unable to load movie details.')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    loadDetails()
    return () => controller.abort()
  }, [movie])

  const isSaved = saved.includes(movie.id)
  const watchlistMovie = { ...details, id: movie.id }
  const imdbRating = details.ratings?.find((rating) => rating.Source === 'Internet Movie Database')?.Value

  return (
    <section className="movie-details">
      <button className="back-button" onClick={onBack}><Icon name="back" size={12} /> Back</button>
      {isLoading ? <div className="empty-state">Loading movie details...</div> : error ? <div className="empty-state">{error}</div> : (
        <>
          <div className="details-hero">
            <div className="details-poster">{details.poster ? <img src={details.poster} alt={`${details.title} poster`} /> : <span>{details.title}</span>}</div>
            <div className="details-copy">
              <span className="section-kicker">IMDb title details</span>
              <h1>{details.title}</h1>
              <div className="details-meta"><span>{details.year}</span><span>{details.certificate || 'NR'}</span><span>{details.duration}</span><span>{details.genre}</span></div>
              <div className="details-rating"><strong><Icon name="star" size={15} /> {details.rating}</strong>{imdbRating && <span>{imdbRating} IMDb</span>}</div>
              <p className="details-plot">{details.description || 'No plot summary is available for this title.'}</p>
              <div className="hero-actions"><button className="primary-button" onClick={() => onPlay(details)}><Icon name="play" size={11} /> Watch now</button><button className="secondary-button" onClick={() => onToggleSave(watchlistMovie)}><Icon name={isSaved ? 'bookmark' : 'watchlist'} size={11} />{isSaved ? ' In watchlist' : ' Add to watchlist'}</button></div>
            </div>
          </div>
          <div className="details-grid">
            <div className="details-panel"><span className="section-kicker">Story & credits</span><h2>About this title</h2><p><strong>Director</strong> {details.director || 'Not listed'}</p><p><strong>Writers</strong> {details.writers || 'Not listed'}</p><p><strong>Cast</strong> {details.actors || 'Not listed'}</p></div>
            <div className="details-panel"><span className="section-kicker">Reception</span><h2>Ratings & review</h2><p><strong>IMDb</strong> {details.rating}</p>{details.ratings?.map((rating) => <p key={rating.Source}><strong>{rating.Source}</strong> {rating.Value}</p>)}<p><strong>Awards</strong> {details.awards || 'Not listed'}</p></div>
          </div>
          <div className="details-facts"><span>{details.language || 'Language not listed'}</span><span>{details.country || 'Country not listed'}</span>{details.boxOffice && <span>{details.boxOffice}</span>}</div>
          <div className="details-more"><span className="section-kicker">You may also like</span><h2>More from your library</h2><div className="movie-grid">{[movie].filter(Boolean).map((item) => <MovieCard key={item.id} movie={item} isSaved={saved.includes(item.id)} onToggleSave={onToggleSave} onPlay={onPlay} onSelect={() => {}} />)}</div></div>
        </>
      )}
    </section>
  )
}
