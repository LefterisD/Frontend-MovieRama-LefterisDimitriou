import * as model from './model.js';
import movieView from './views/movieView.js';
import searchView from './views/searchView.js';
import { debounce } from './helpers.js';
import { DEBOUNCE,  SCROLL_THRESHOLD } from './config.js';

/**
 * Fetches and displays the movies that are currently playing in theaters.
 *
 * This function retrieves the list of "Now Playing" movies using the `model.fetchPlayingNowMovies` method and renders them using `movieView`.
 *
 * @async
 * @throws {Error} Throws an error if the fetching or rendering process fails.
 */

const controlMovies = async () => {
  try {
    // movieView.renderSpinner();

    await model.fetchPlayingNowMovies();
    // movieView.removeSpinner();
    movieView.render(model.state.nowPlaying);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Fetches and displays search results based on the user query.
 *
 * This function is debounced to limit the frequency of API calls while the user is typing. It retrieves search results using the `model.loadSearchResults` method and renders them using `movieView`.
 *
 * @async
 * @param {string} query - The user's search query.
 * @throws {Error} Logs an error if the search process fails.
 */

const controlSearchResults = debounce(async query => {
  try {
    await model.loadSearchResults(query); // Await the search results
    movieView.render(model.state.search.results); // Render the movies
  } catch (error) {
    console.error('Error in controlSearchResults:', error);
  }
}, DEBOUNCE);

/**
 * Handles user scroll events to load more movies when reaching the bottom of the page.
 *
 * This function calculates the user's scroll position and checks if they are near the bottom of the page.
 * If so, it either fetches more "Now Playing" movies or loads additional search results, depending on the active state.
 */

const handleUserScroll = () => {
  // Calculate the distance to the bottom of the page
  const scrollPosition = window.scrollY + window.innerHeight;
  const bottomPosition = document.documentElement.scrollHeight;

  // Trigger fetch if the user is within 300px from the bottom of the page
  if (scrollPosition >= bottomPosition - SCROLL_THRESHOLD) {
    if (model.state.search.query === '') controlMovies();

    if (model.state.search.query !== '') handleInputChange();
  }
};

/**
 * Handles user input in the search bar to fetch and display results or reset the view.
 *
 * This function reads the user's query, determines if it has changed, and updates the state accordingly.
 * If the query is empty, it resets the view to display "Now Playing" movies.
 * Otherwise, it triggers the `controlSearchResults` function to fetch and display search results.
 *
 * @async
 */

const handleInputChange = async () => {
  const query = searchView.getQuery();

  if (!query) {
    model.state.page = 1;
    model.state.nowPlaying = [];

    controlMovies();

    movieView.changeHeader('Playing this week');

    return;
  }

  if (model.state.search.query !== query) {
    model.state.search.results = [];
    model.state.page = 1;

    movieView.changeHeader(`Results for: <i>${query}</i>`);
  }

  model.state.search.query = query;

  await controlSearchResults(query);
};

/**
 * Loads movie genres and initializes the display of "Now Playing" movies.
 *
 * This function fetches the available movie genres using `model.loadMovieGenres` and then calls `controlMovies` to display the movies.
 *
 * @async
 * @throws {Error} Throws an error if loading genres or movies fails.
 */

const controlGenres = async () => {
  try {
    await model.loadMovieGenres();
    await controlMovies();
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Handles the expansion of a movie card to display additional details, such as trailers, reviews, and similar movies.
 *
 * This function fetches and displays the additional details of a selected movie. It first checks if the movie is expanded, 
 * then loads reviews, videos, and similar movies using the appropriate `model` methods, and renders the details using `movieView`.
 *
 * @async
 * @param {Event} event - The event triggered by the user clicking on a movie card.
 * @throws {Error} Throws an error if fetching or rendering the movie details fails.
 */

const controlMovieDetails = async event => {
  const movieId = movieView.getClickedMovieAndExpand(event);
  const isExpanded = movieView.getMovieExpandedState(event);

  if (!isExpanded) return;

  movieView.renderDetailsSpinner();

  try {
    await model.loadMovieReviews(movieId);
    await model.loadMovieVideos(movieId);
    await model.loadMovieSimilar(movieId);

    movieView.removeSpinner();
    movieView.renderMovieDetails(event);
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Initializes the application by setting up event handlers and fetching initial data.
 *
 * This function loads the movie genres, sets up event listeners for scrolling, movie card expansion, and search input changes, 
 * and displays the "Now Playing" movies.
 */

const init = () => {
  controlGenres();
  movieView.addHandlerRender(handleUserScroll);
  movieView.addHandlerExpand(controlMovieDetails);
  searchView.addHandlerSearch(handleInputChange);
};

init();
