import * as model from './model.js';
import movieView from './views/movieView.js';
import searchView from './views/searchView.js';
import { debounce } from './helpers.js';
import { DEBOUNCE } from './config.js';

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

const controlSearchResults = debounce(async query => {
  try {
    await model.loadSearchResults(query); // Await the search results
    movieView.render(model.state.search.results); // Render the movies
  } catch (error) {
    console.error('Error in controlSearchResults:', error);
  }
}, DEBOUNCE);

const handleUserScroll = () => {
  // Calculate the distance to the bottom of the page
  const scrollPosition = window.scrollY + window.innerHeight;
  const bottomPosition = document.documentElement.scrollHeight;

  // Trigger fetch if the user is within 300px from the bottom of the page
  if (scrollPosition >= bottomPosition - 300) {
    if (model.state.search.query === '') controlMovies();

    if (model.state.search.query !== '') handleInputChange();
  }
};

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

const controlGenres = async () => {
  try {
    await model.loadMovieGenres();
  } catch (error) {
    throw new Error(error);
  }
};

const init = () => {
  controlGenres();
  controlMovies();
//   movieView.addHandlerRender(handleUserScroll);
  searchView.addHandlerSearch(handleInputChange);
};

init();
