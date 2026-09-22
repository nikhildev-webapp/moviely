import Icon from './Icon'

export default function Hero({ movie, isSaved, onPlay, onToggleSave }) {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow"><span className="live-dot" /> IMDb spotlight</span>
        <h1>{movie.title}</h1>
        <div className="hero-meta"><span className="imdb">IMDb</span><strong>{movie.rating}</strong><span>{movie.year}</span><span>{movie.duration}</span><span>{movie.certificate}</span></div>
        <p>{movie.description}</p>
        <div className="hero-actions"><button className="primary-button" onClick={() => onPlay(movie)}><Icon name="play" size={11} /> Watch now</button><button className="secondary-button" onClick={() => onToggleSave(movie)}><Icon name={isSaved ? 'bookmark' : 'watchlist'} size={11} />{isSaved ? ' In watchlist' : ' Add to watchlist'}</button></div>
      </div>
      <div className="hero-art"><div className="hero-orb" /><div className="hero-sun" /><div className="hero-dune dune-one" /><div className="hero-dune dune-two" /><span className="hero-rating"><Icon name="star" size={10} /> {movie.rating}</span></div>
    </section>
  )
}
