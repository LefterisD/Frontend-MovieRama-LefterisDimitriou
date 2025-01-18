import * as model from './model.js';
import movieView from './views/movieView.js';

const renderMovies = async () => {
  try {

    movieView.renderSpinner();

    const movies = await model.fetchPlayingNowMovies();
    movieView.removeSpinner();
    movieView.render(movies);
    
  } catch (error) {
    throw new Error(error);
  }
};

const handleUserScroll = () => {
  // Calculate the distance to the bottom of the page
  const scrollPosition = window.scrollY + window.innerHeight;
  const bottomPosition = document.documentElement.scrollHeight;

  // Trigger fetch if the user is within 300px from the bottom of the page
  if (scrollPosition >= bottomPosition - 300) {
    renderMovies();
  }
};

const init = () => {
    renderMovies();
    movieView.addHandlerRender(handleUserScroll);
}

init();
