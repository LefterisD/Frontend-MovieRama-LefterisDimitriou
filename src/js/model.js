import { API_KEY, API_URL } from './config.js';
import { getJSON } from './helpers.js';

/**
 * Application state object for managing movie data, search results, genres, and selected movie details.
 *
 * @property {Object[]} nowPlaying - List of currently playing movies.
 * @property {Object[]} genres - List of available movie genres.
 * @property {number} page - Current page number for paginated requests.
 * @property {Object} search - Search-related state.
 * @property {string} search.query - Current search query string.
 * @property {Object[]} search.results - List of search result movies.
 * @property {Object} selectedMovie - Details of the currently selected movie.
 * @property {Object[]} selectedMovie.reviews - Reviews for the selected movie.
 * @property {Object[]} selectedMovie.videos - Video trailers for the selected movie.
 * @property {Object[]} selectedMovie.similar - Similar movies to the selected movie.
 */

export const state = {
  nowPlaying: [],
  genres: [],
  page: 1,
  search: {
    query: '',
    results: [],
  },
  selectedMovie: {
    reviews: [],
    videos: [],
    similar: [],
  },
};
let isFetching = false;

/**
 * Fetches the list of movies currently playing in theaters and updates the state.
 *
 * This function prevents multiple simultaneous fetches using an `isFetching` flag. 
 * The results are added to the `state.nowPlaying` array, and the page counter is incremented.
 *
 * @async
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const fetchPlayingNowMovies = async () => {
  if (isFetching) return; // Prevent multiple fetches at the same time
  isFetching = true;

  try {
    const data = await getJSON(
      `${API_URL}movie/now_playing?language=en-US&page=${state.page}`,
    );
    const movies = data.results;

    state.nowPlaying.push(...movies);

    isFetching = false;
    state.page++;
  } catch (error) {
    isFetching = false;
    console.error(error);
  }
};

/**
 * Fetches search results for a given query and updates the state.
 *
 * The function prevents multiple simultaneous fetches using an `isFetching` flag. 
 * The results are added to the `state.search.results` array, and the page counter is incremented.
 *
 * @async
 * @param {string} query - The search query string.
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const loadSearchResults = async query => {
  if (isFetching) return; // Prevent multiple fetches at the same time
  isFetching = true;

  try {
    const data = await getJSON(
      `${API_URL}search/movie?include_adult=false&language=en-US&page=${state.page}&query=${query}`,
    );
    const movies = data.results;
    state.search.results.push(...movies);

    isFetching = false;
    state.page++;
  } catch (error) {
    isFetching = false;
    console.error(error);
  }
};

/**
 * Fetches the list of movie genres and updates the state.
 *
 * The fetched genres are stored in the `state.genres` array.
 *
 * @async
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const loadMovieGenres = async () => {
  try {
    const data = await getJSON(
      `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );
    const { genres } = data;

    state.genres = genres;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetches reviews for a specific movie by ID and updates the state.
 *
 * The first two reviews are stored in the `state.selectedMovie.reviews` array.
 *
 * @async
 * @param {number} id - The ID of the movie to fetch reviews for.
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const loadMovieReviews = async id => {
  try {
    const data = await getJSON(
      `${API_URL}movie/${id}/reviews?language=en-US&page=1`,
    );

    const reviews = data.results.slice(0, 2);

    state.selectedMovie.reviews = reviews;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetches video trailers for a specific movie by ID and updates the state.
 *
 * The function filters the videos to include only those of type "Trailer" 
 * and stores them in the `state.selectedMovie.videos` array.
 *
 * @async
 * @param {number} id - The ID of the movie to fetch videos for.
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const loadMovieVideos = async id => {
  try {
    const data = await getJSON(`${API_URL}movie/${id}/videos?language=en-US`);
    const videos = data.results.filter(video => video.type === 'Trailer');
    state.selectedMovie.videos = videos;
  } catch (error) {
    console.error(error);
  }
};

/**
 * Fetches similar movies for a specific movie by ID and updates the state.
 *
 * The first six similar movies are stored in the `state.selectedMovie.similar` array.
 *
 * @async
 * @param {number} id - The ID of the movie to fetch similar movies for.
 * @throws {Error} Logs an error if the fetch request fails.
 */

export const loadMovieSimilar = async id => {
  try {
    const data = await getJSON(
      `${API_URL}movie/${id}/similar?language=en-US&page=1`,
    );
    state.selectedMovie.similar = data.results.slice(0, 6);
  } catch (error) {
    console.error(error);
  }
};
