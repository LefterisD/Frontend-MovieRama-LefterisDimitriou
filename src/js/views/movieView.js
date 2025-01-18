import { buildPosterPath } from '../helpers.js';

class MovieView {
  #parentElement = document.querySelector('.in__theater__container');
  #data;

  buildMovieMarkup(movieData) {
    const movie_poster_path = buildPosterPath(movieData.poster_path, 'w500');

    return `
        <div class="movie__container">
            <div class="movie__poster__container">
                <img loading="lazy" src="${movie_poster_path}" alt="poster-image" />
            </div>
            <div class="movie__content">
                <h2 class="movie__title">${movieData.title}</h2>
                <div class="movie__info">
                <h6 class="movie__info__item">${movieData.release_date.slice(0, 4)} /</h6>
                <h6 class="movie__info__item">Fiction /</h6>
                <h6 class="movie__info__item">${movieData.vote_average}</h6>
                </div>
                <div class="movie__summary__container">
                    <h4>Summary</h4>
                    <p class="movie__summary">
                        ${movieData.overview}
                    </p>
                </div>
            </div>
        </div>
              `;
  }

  renderSpinner() {
    const markup = `<span class="loader"></span>`;
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  removeSpinner() {
    document.querySelector('.loader').remove();
  }

  #generateMarkup() {
    this.#data.forEach(movie => {
      this.#parentElement.insertAdjacentHTML(
        'beforeend',
        this.buildMovieMarkup(movie),
      );
    });
  }

  addHandlerRender(handler) {
    window.addEventListener('scroll', handler);
  }

  render(data) {
    this.#data = data;

    this.#generateMarkup();
  }
}

export default new MovieView();
