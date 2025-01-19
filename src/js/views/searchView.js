class SearchView {
  _parentElement = document.querySelector('.form__container__form');

  getQuery() {
    return this._parentElement.querySelector('.form__container__form__input')
      .value.trim();
  }

  addHandlerSearch(handler) {
    this._parentElement
      .querySelector('.form__container__form__input')
      .addEventListener('input', handler);
  }
}

export default new SearchView();
