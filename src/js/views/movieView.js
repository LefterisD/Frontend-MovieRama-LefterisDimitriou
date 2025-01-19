import { buildPosterPath } from '../helpers.js';
import * as model from '../model.js';

class MovieView {
  _parentElement = document.querySelector('.in__theater__container');
  _data;

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
                    <h6 class="movie__info__item flex"><img src="src/img/star.svg"> ${Math.round(movieData.vote_average * 10) / 10}</h6>
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

  renderSpinner() {
    const markup = `<span class="loader"></span>`;
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderDetailsSpinner() {
    const markup = `<span class="loader"></span>`;

    const movieExpanded = document.querySelector('.expanded');
    movieExpanded.querySelector('.movie__expanded__content').insertAdjacentHTML('afterbegin', markup);
  }

  removeSpinner() {
    document.querySelector('.loader').remove();
  }

  changeHeader(text) {
    document.querySelector('.movie__list__header').innerHTML = text;
  }

  _generateMarkup() {
    this._clear();
    this._data.forEach(movie => {
      this._parentElement.insertAdjacentHTML(
        'beforeend',
        this.buildMovieMarkup(movie),
      );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderMovieDetails(event) {
    const movieCard = event.target.closest('.movie__container');
    const isExpanded = this.getMovieExpandedState(event);

    const videoKey = model.state.selectedMovie.videos[0].key;
    const reviews = model.state.selectedMovie.reviews;
    const similarMovies = model.state.selectedMovie.similar;

    if (isExpanded) {
      movieCard.querySelector('.movie__trailer').innerHTML = `
            <iframe src="https://www.youtube.com/embed/${videoKey}" frameborder="0" allowfullscreen></iframe>`;

      movieCard.querySelector('.movie__similar__movies').innerHTML = similarMovies.map(movie => {
        const movie_poster_path = buildPosterPath(movie.poster_path, 'w500');
        return `
        <div class="similar__movie">
            <img src="${movie_poster_path}" alt="similar-movie-poster">
            <h4 class="similar__movie__title">${movie.title}</h4>
        </div>
        `
      })

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

  getMovieExpandedState(event) {
    const movieCard = event.target.closest('.movie__container');

    return movieCard.classList.contains('expanded');
  }

  addHandlerRender(handler) {
    window.addEventListener('scroll', handler);
  }

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
