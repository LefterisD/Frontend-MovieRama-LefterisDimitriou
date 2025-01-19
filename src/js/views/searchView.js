class SearchView {
  #parentElement = document.querySelector('.form__container__form');

  getQuery() {
    return this.#parentElement.querySelector('.form__container__form__input')
      .value.trim();
  }

  addHandlerSearch(handler) {
    this.#parentElement
      .querySelector('.form__container__form__input')
      .addEventListener('input', handler);
  }
}

export default new SearchView();
