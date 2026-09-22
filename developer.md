# Moviely Developer Guide

## Overview
Moviely is a React + Vite movie discovery app that lets users browse movie recommendations, search by title, save titles to a watchlist, and group saved titles by genre. The interface is built around a single top-level app state in `src/App.jsx` and a set of reusable UI components under `src/components/`.

## Stack
- React 19
- Vite 8
- JavaScript (not TypeScript)
- Tailwind CSS v4 via Vite plugin
- OMDb-style movie API via environment-driven fetch calls

## Project structure
- `src/App.jsx` — main application state, API loading logic, page routing, saved/watchlist handling
- `src/main.jsx` — app bootstrap
- `src/data/movies.js` — static movie seed data and nav/genre constants
- `src/components/` — UI building blocks
  - `Navbar.jsx` — top navigation and global search bar
  - `Hero.jsx` — landing-area movie spotlight
  - `MovieSection.jsx` — generic list/grid view for home/discover/watchlist
  - `MovieCard.jsx` — movie tile UI with save/play/select actions
  - `Collections.jsx` — watchlist grouped by genre
  - `MovieDetails.jsx` — detailed movie modal-like view with extended metadata
  - `Icon.jsx` — icon wrapper for the app’s icon set
- `src/App.css` — styling for the app UI
- `README.md` — default Vite template; currently needs project-specific documentation updates
- `.env` — local environment configuration

## Core app behavior
### Navigation and content views
The app uses `activeNav` to switch between:
- Home
- Discover
- Collections
- Watchlist

This state lives in `App.jsx` and controls which sections render.

### Search flow
- When the search box query contains at least 2 characters, the app attempts a remote movie search.
- Search results are stored in `searchMovies` and displayed in the Discover view.
- The `query` input updates `activeNav` to `Discover` if the user types while not already on that page.
- If the query is empty, the app falls back to curated “top picks” loaded from the API.

### Watchlist / saved titles
- `saved` is an array of movie IDs.
- `savedMovies` is an array of full movie objects.
- `toggleSaved` adds/removes IDs and objects in sync.
- Collections are derived from saved movie objects by matching `movie.genre`.
- The watchlist is persisted in browser `localStorage` under the `moviely-watchlist` key.
- The stored value has the shape `{ saved, savedMovies }`. On startup, saved movie objects are restored and their IDs are used to rebuild `saved`.
- Invalid or unavailable storage falls back to the seeded watchlist entry and logs an error.

### External movie data
The app fetches movie results and details from an API endpoint provided by `import.meta.env.VITE_API_KEY`.

Important implementation detail:
- The app expects `VITE_API_KEY` to be a valid OMDb-style URL or base URL for the movie service.
- During fetches, it mutates the URL with search params such as `s`, `i`, `t`, and `plot` to request different movie data.
- When the variable is missing, the app shows a user-facing configuration error instead of crashing.

## Environment setup
Create a `.env` file in the project root with the API base URL.

Example:
```bash
VITE_API_KEY=https://www.omdbapi.com/?apikey=YOUR_API_KEY
```

If your API provider differs, adjust to match the service contract used by the fetch code in `App.jsx` and `MovieDetails.jsx`.

## Development commands
From the project root:

```bash
npm install
npm run dev
```

Production build:
```bash
npm run build
```

Linting:
```bash
npm run lint
```

## Key conventions and rules for future updates
### 1. Keep app state centralized
Most cross-component behaviors are orchestrated in `App.jsx`. If you add new feature state, prefer to keep it in the top-level app unless a component truly owns it.

### 2. Preserve movie normalization
The `mapMovie` helper in `App.jsx` normalizes raw API responses into a consistent format:
- stable `id`
- title and year fallback values
- genre fallback
- rating, duration, poster fallbacks
- accent color assignment

When adding new fields, extend this mapping carefully so UI components receive consistent data.

### 3. API errors should remain user-friendly
The app surfaces configuration and fetch errors to users through `empty-state` UI blocks. Avoid silent failures or unhandled runtime exceptions in network code.

### 4. Keep list/grid patterns consistent
The app uses a shared pattern for movie display:
- `MovieSection` for list views
- `MovieCard` for individual tiles
- `Collections` for grouped saved items

Follow the same structure when creating new content sections.

### 5. Preserve saved state semantics
Watchlist logic depends on both:
- `saved` as a list of IDs
- `savedMovies` as the actual movie objects

When modifying save behavior, keep these two arrays synchronized.

## Known current notes
- `README.md` is still the default Vite starter content and should be replaced with project-specific documentation.
- When no watchlist has been stored yet, the app initializes both `saved` and `savedMovies` with a default movie entry (`[3]` / `[movies[2]]`), which makes the watchlist non-empty on first load.
- The app assumes the external API is available and configured; without `VITE_API_KEY`, several flows display configuration warnings.
- There are no tests in the repository yet; validation is currently done through build/lint checks and manual UI testing.

## Recommended future maintenance tasks
- Replace the generic README content with application-specific onboarding and release notes.
- Add a `.env.example` file for shared setup instructions.
- Consider moving API logic into dedicated hooks/services for easier testing and reuse.
- Add automated tests for watchlist toggling, search behavior, and UI state transitions.
- Review whether the app should support a real backend or persistent storage for user watchlists.

## Quick references
- App state and API orchestration: `src/App.jsx`
- Static movie dataset: `src/data/movies.js`
- Navigation UI: `src/components/Navbar.jsx`
- Grid content section: `src/components/MovieSection.jsx`
- Detailed movie panel: `src/components/MovieDetails.jsx`
- Watchlist grouping: `src/components/Collections.jsx`
