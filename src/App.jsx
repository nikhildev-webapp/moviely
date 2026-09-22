import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { movies } from "./data/movies";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import MovieSection from "./components/MovieSection";
import Collections from "./components/Collections";
import MovieDetails from "./components/MovieDetails";
import Icon from "./components/Icon";

const apiUrl = import.meta.env.VITE_API_KEY;
const WATCHLIST_STORAGE_KEY = "moviely-watchlist";

function textValue(value, fallback = "") {
  return typeof value === "string" || typeof value === "number"
    ? String(value)
    : fallback;
}

function mapMovie(movie, index, genre = "Movie") {
  const safeGenre = textValue(genre, "Movie");
  return {
    id: textValue(movie?.imdbID, `search-${index}`),
    title: textValue(movie?.Title, "Untitled movie"),
    year: textValue(movie?.Year).slice(0, 4) || "—",
    genre:
      textValue(movie?.Genre) && movie.Genre !== "N/A"
        ? textValue(movie.Genre)
        : safeGenre,
    rating:
      textValue(movie?.imdbRating) && movie.imdbRating !== "N/A"
        ? textValue(movie.imdbRating)
        : "—",
    duration:
      textValue(movie?.Runtime) && movie.Runtime !== "N/A"
        ? textValue(movie.Runtime)
        : "Feature",
    poster:
      textValue(movie?.Poster) && movie.Poster !== "N/A"
        ? textValue(movie.Poster)
        : "",
    accent: ["#6d4b8d", "#4c708d", "#a17752", "#7a536f"][index % 4],
  };
}

function getInitialWatchlist() {
  const defaultWatchlist = {
    saved: [3],
    savedMovies: [movies[2]],
  };

  try {
    const storedWatchlist = window.localStorage.getItem(WATCHLIST_STORAGE_KEY);
    if (!storedWatchlist) return defaultWatchlist;

    const parsedWatchlist = JSON.parse(storedWatchlist);
    if (
      !Array.isArray(parsedWatchlist?.saved) ||
      !Array.isArray(parsedWatchlist?.savedMovies)
    ) {
      return defaultWatchlist;
    }

    const savedMovies = parsedWatchlist.savedMovies.filter(
      (movie) => movie && (typeof movie.id === "string" || typeof movie.id === "number"),
    );
    const saved = savedMovies.map((movie) => movie.id);

    return { saved, savedMovies };
  } catch (error) {
    console.error("Unable to restore the watchlist.", error);
    return defaultWatchlist;
  }
}

function App() {
  const [activeNav, setActiveNav] = useState("Home");
  const [activeGenre, setActiveGenre] = useState("All");
  const [query, setQuery] = useState("");
  const [initialWatchlist] = useState(getInitialWatchlist);
  const [saved, setSaved] = useState(initialWatchlist.saved);
  const [savedMovies, setSavedMovies] = useState(initialWatchlist.savedMovies);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [notice, setNotice] = useState("");
  const [searchMovies, setSearchMovies] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [topPicksByGenre, setTopPicksByGenre] = useState({});
  const [isLoadingPicks, setIsLoadingPicks] = useState(true);
  const [picksError, setPicksError] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        WATCHLIST_STORAGE_KEY,
        JSON.stringify({ saved, savedMovies }),
      );
    } catch (error) {
      console.error("Unable to save the watchlist.", error);
    }
  }, [saved, savedMovies]);

  useEffect(() => {
    const controller = new AbortController();

    const loadTopPicks = async () => {
      if (!apiUrl) {
        setIsLoadingPicks(false);
        setPicksError(
          "Top picks are not configured. Add VITE_API_KEY to your .env file.",
        );
        return;
      }

      try {
        const categories = ["Action", "Drama", "Sci-Fi", "Crime", "Animation"];
        const results = await Promise.all(
          categories.map(async (genre) => {
            const url = new URL(apiUrl);
            url.searchParams.delete("i");
            url.searchParams.set("s", genre);
            url.searchParams.set("type", "movie");
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok)
              throw new Error("The movie service is unavailable.");

            const data = await response.json();
            if (data.Response === "False")
              throw new Error(data.Error || `Unable to load ${genre} picks.`);
            return [
              genre,
              (Array.isArray(data.Search) ? data.Search : []).map(
                (movie, index) => mapMovie(movie, index, genre),
              ),
            ];
          }),
        );

        const grouped = Object.fromEntries(results);
        const allMovies = [
          ...results.flatMap(([, categoryMovies]) => categoryMovies),
        ].filter(
          (movie, index, collection) =>
            collection.findIndex((item) => item.id === movie.id) === index,
        );
        setTopPicksByGenre({ All: allMovies, ...grouped });
      } catch (error) {
        if (error.name !== "AbortError") {
          setPicksError(error.message || "Unable to load top picks.");
        }
      } finally {
        if (!controller.signal.aborted) setIsLoadingPicks(false);
      }
    };

    loadTopPicks();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const searchTerm = query.trim();
    if (searchTerm.length < 2) return undefined;

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      if (!apiUrl) {
        setSearchError(
          "Search is not configured. Add VITE_API_KEY to your .env file.",
        );
        return;
      }

      setIsSearching(true);
      setSearchError("");
      try {
        const url = new URL(apiUrl);
        url.searchParams.delete("i");
        url.searchParams.set("s", searchTerm);
        url.searchParams.set("type", "movie");
        const response = await fetch(url, { signal: controller.signal });
        if (!response.ok) throw new Error("The movie service is unavailable.");
        const data = await response.json();
        if (data.Response === "False") {
          setSearchMovies([]);
          setSearchError(textValue(data.Error, "No movies found."));
        } else {
          setSearchMovies(
            (Array.isArray(data.Search) ? data.Search : []).map(
              (movie, index) => mapMovie(movie, index),
            ),
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setSearchMovies([]);
          setSearchError(
            textValue(error.message, "Unable to search right now."),
          );
        }
      } finally {
        if (!controller.signal.aborted) setIsSearching(false);
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const filteredMovies = useMemo(
    () =>
      (topPicksByGenre[activeGenre] || []).filter((movie) =>
        `${movie.title} ${movie.genre}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [activeGenre, query, topPicksByGenre],
  );

  const visibleMovies =
    query.trim().length >= 2 ? searchMovies : filteredMovies;
  const isHome = activeNav === "Home";
  const isDiscover = activeNav === "Discover";
  const isCollections = activeNav === "Collections";
  const isWatchlist = activeNav === "Watchlist";

  const handlePlay = (movie) => {
    setNotice(`Now playing ${movie.title}`);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const toggleSaved = (movie) => {
    setSaved((current) =>
      current.includes(movie.id)
        ? current.filter((item) => item !== movie.id)
        : [...current, movie.id],
    );
    setSavedMovies((current) =>
      current.some((item) => item.id === movie.id)
        ? current.filter((item) => item.id !== movie.id)
        : [...current, movie],
    );
  };

  const handleQueryChange = (value) => {
    setQuery(value);
    if (value.trim() && activeNav !== "Discover") setActiveNav("Discover");
  };

  const openMovieDetails = (movie) => setSelectedMovie(movie);

  return (
    <div className="app-shell">
      <main className="main-content">
        <Navbar
          activeNav={activeNav}
          onNavigate={setActiveNav}
          savedCount={saved.length}
          query={query}
          onQueryChange={handleQueryChange}
        />
        {selectedMovie ? (
          <MovieDetails
            movie={selectedMovie}
            saved={saved}
            onToggleSave={toggleSaved}
            onPlay={handlePlay}
            onBack={() => setSelectedMovie(null)}
          />
        ) : (
          <>
            {isHome && (
              <Hero
                movie={movies[0]}
                isSaved={saved.includes(1)}
                onPlay={handlePlay}
                onToggleSave={toggleSaved}
              />
            )}
            {isCollections && (
              <Collections
                movies={savedMovies}
                saved={saved}
                onToggleSave={toggleSaved}
                onPlay={handlePlay}
                onSelectMovie={openMovieDetails}
              />
            )}
            {isHome && (
              <MovieSection
                movies={visibleMovies}
                query={query}
                activeGenre={activeGenre}
                onGenreChange={setActiveGenre}
                isSearching={isSearching || (!query.trim() && isLoadingPicks)}
                error={searchError || (!query.trim() && picksError)}
                saved={saved}
                onToggleSave={toggleSaved}
                onPlay={handlePlay}
                onSelectMovie={openMovieDetails}
              />
            )}
            {isDiscover && (
              <MovieSection
                title="Discover"
                movies={visibleMovies}
                query={query}
                activeGenre={activeGenre}
                onGenreChange={setActiveGenre}
                isSearching={isSearching}
                error={searchError}
                saved={saved}
                onToggleSave={toggleSaved}
                onPlay={handlePlay}
                onSelectMovie={openMovieDetails}
              />
            )}
            {isWatchlist && (
              <MovieSection
                title="Watchlist"
                movies={savedMovies}
                query=""
                activeGenre="All"
                onGenreChange={setActiveGenre}
                isSearching={false}
                error=""
                saved={saved}
                onToggleSave={toggleSaved}
                onPlay={handlePlay}
                onSelectMovie={openMovieDetails}
                showFilters={false}
              />
            )}
          </>
        )}
      </main>
      {notice && (
        <div className="toast">
          <Icon name="play" size={11} />
          {notice}
        </div>
      )}
    </div>
  );
}

export default App;
