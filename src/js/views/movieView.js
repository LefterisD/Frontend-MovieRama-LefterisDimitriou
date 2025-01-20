import { buildPosterPath } from '../helpers.js';
import * as model from '../model.js';
import starSvg from 'url:../../img/star.svg';
class MovieView {
  _parentElement = document.querySelector('.in__theater__container');
  _data;

  /**
   * Generates the HTML markup for a movie's details.
   *
   * This function constructs and returns an HTML string representation of a movie's details,
   * including the poster, title, release year, genres, rating, summary, and placeholders
   * for expanded content such as similar movies and user reviews.
   *
   * @param {Object} movieData - The data object containing details about the movie.
   *
   * @returns {string} An HTML string representing the movie's details, ready for insertion into the DOM.
   *
   */
  buildMovieMarkup(movieData) {
    const movie_poster_path = buildPosterPath(movieData.poster_path, 'w500');

    return `
        <div class="movie__container" data-id="${movieData.id}">
            <div class="movie__poster__container">
                <img loading="lazy" src="${movie_poster_path}" alt="poster-image" />
            </div>
            <div class="movie__content">
                <h2 class="movie__title">${movieData.title}</h2>
                <div class="movie__info">
                    <h6 class="movie__info__item flex"><img src="${starSvg}"> ${Math.round(movieData.vote_average * 10) / 10}</h6>
                    <h6 class="movie__info__item">· ${movieData.release_date.slice(0, 4)} ·</h6>
                    <h6 class="movie__info__item"><ul class="genre__list">${this._renderMovieGenres(movieData.genre_ids)} </ul></h6>    
                </div>
                <div class="movie__summary__container">
                    <h4>Summary</h4>
                    <p class="movie__summary">
                        ${movieData.overview}
                    </p>
                </div>
            </div>
            <!-- Placeholder for expanded content -->
            <div class="movie__expanded__content">
                <div class="movie__trailer"></div>
                <h4 class="details__title">Similar movies</h4>
                <div class="movie__similar__movies"></div>
                <h4 class="details__title">User reviews</h4>
                <div class="movie__ratings"></div>
            </div>
        </div>
    `;
  }

  /**
   * Renders a subset of movie genres as a list of HTML `<li>` elements.
   *
   * This method takes an array of genre objects, keeps only their names, and
   * returns an HTML string containing the first
   * two genres as list items.
   *
   * @param {object[]} genre_ids - An array of genre IDs associated with the movie.
   * @returns {string} An HTML string with up to two `<li>` elements representing the genres.
   *
   * // Output: "<li>Action</li><li>Adventure</li>"
   */

  _renderMovieGenres(genre_ids) {
    let genres = genre_ids.map(id => {
      const genre = model.state.genres.find(g => g.id === id);

      return genre.name;
    });

    return genres
      .slice(0, 2)
      .map(genre => `<li>${genre}</li>`)
      .join('');
  }

  /**
   *
   * Renders spinner into the page.
   *
   */
  renderSpinner() {
    const markup = `<span class="loader"></span>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   *
   * Renders spinner into the details div.
   *
   */
  renderDetailsSpinner() {
    const markup = `<span class="loader"></span>`;

    const movieExpanded = document.querySelector('.expanded');
    movieExpanded
      .querySelector('.movie__expanded__content')
      .insertAdjacentHTML('afterbegin', markup);
  }

  /**
   *
   * Remove spinner from page.
   *
   */
  removeSpinner() {
    document.querySelector('.loader').remove();
  }

  /**
   *
   * Changes the text of the heading.
   *
   * @param {string} text - Text to be placed inside the heading element.
   */
  changeHeader(text) {
    document.querySelector('.movie__list__header').innerHTML = text;
  }

  /**
   *
   * Clears the parent element and renders the movies in it.
   *
   */
  _generateMarkup() {
    this._clear();
    this._data.forEach(movie => {
      this._parentElement.insertAdjacentHTML(
        'beforeend',
        this.buildMovieMarkup(movie),
      );
    });
  }

  /**
   *
   * Clears the parent element.
   *
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Renders additional details for a selected movie, including the trailer, similar movies, and user reviews.
   *
   * This method is triggered by an event, locates the closest movie card element, and updates its
   * content with the movie's trailer, similar movies, and user reviews if the movie's expanded state is active.
   *
   * @param {Event} event - The event object triggered by the user interaction (e.g., a click).
   *
   */

  renderMovieDetails(event) {
    const movieCard = event.target.closest('.movie__container');
    const isExpanded = this.getMovieExpandedState(event);

    const videoKey = model.state.selectedMovie.videos[0].key;
    const reviews = model.state.selectedMovie.reviews;
    const similarMovies = model.state.selectedMovie.similar;

    if (isExpanded) {
      movieCard.querySelector('.movie__trailer').innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`;

      movieCard.querySelector('.movie__similar__movies').innerHTML =
        similarMovies
          .map(movie => {
            const movie_poster_path = buildPosterPath(
              movie.poster_path,
              'w500',
            );
            return `
          <div class="similar__movie">
              <img src="${movie_poster_path}" alt="similar-movie-poster">
              <h4 class="similar__movie__title">${movie.title}</h4>
          </div>
        `;
          })
          .join('');

      movieCard.querySelector('.movie__ratings').innerHTML = reviews.map(
        review => {
          return `
            <div class="user__info">
                <span class="user__info__author">${review.author}</span>
                <span class="user__info__rating">${review.author_details.rating}/10</span>
            </div>
            <i class="user__review">${review.content}</i>
            `;
        },
      );
    }
  }

  /**
   * Handles the expansion and collapse of a movie card based on a user click event.
   *
   * This method identifies the movie card associated with the click event, toggles its expanded state,
   * and ensures that only one movie card is expanded at a time. If the card is being expanded, its
   * associated movie ID is returned.
   *
   * @param {Event} event - The event object triggered by the user interaction (e.g., a click).
   *
   *
   * @returns {string|undefined} - The `data-id` of the movie card if it is expanded, or `undefined` if no card is expanded.
   *
   */

  getClickedMovieAndExpand(event) {
    const movieCard = event.target.closest('.movie__container');
    if (!movieCard) return;

    const isexpanded = movieCard.classList.contains('expanded');

    document
      .querySelectorAll('.movie__container')
      .forEach(card => card.classList.remove('expanded'));

    if (!isexpanded) movieCard.classList.add('expanded');
    if (isexpanded) {
      movieCard.classList.remove('expanded');
    }

    return movieCard.dataset.id;
  }

  /**
   * Given an event returns the state of the card if it exapnded or not/
   *
   *
   * @param {Event} event - The event object triggered by the user interaction (e.g., a click).
   *
   *
   * @returns {boolean} - True if the movie card is expanded otherwise false.
   *
   */
  getMovieExpandedState(event) {
    const movieCard = event.target.closest('.movie__container');

    return movieCard.classList.contains('expanded');
  }

  /**
   * Attaches a scroll event listener to the `window` object.
   *
   * This method registers a given handler function to be executed whenever the user scrolls the window.
   *
   * @param {Function} handler - The callback function to be executed on the `scroll` event.
   */
  addHandlerRender(handler) {
    window.addEventListener('scroll', handler);
  }

    /**
   * Attaches a click event listener to the parent element.
   *
   * This method registers a given handler function to be executed whenever the user clicks the parent element.
   *
   * @param {Function} handler - The callback function to be executed on the `scroll` event.
   */
  addHandlerExpand(handler) {
    this._parentElement.addEventListener('click', async event => {
      await handler(event);
    });
  }

  render(data) {
    this._data = data;
    this._generateMarkup();
  }
}

export default new MovieView();
