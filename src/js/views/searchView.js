class SearchView {
  _parentElement = document.querySelector('.form__container__form');

  /**
   * Retrieves the value entered in the search input field.
   *
   * This method fetches the text from the input element within the form, trims any leading or trailing whitespace,
   * and returns it.
   *
   * @returns {string} The trimmed value from the search input field.
   *
   */

  getQuery() {
    return this._parentElement
      .querySelector('.form__container__form__input')
      .value.trim();
  }

  /**
   * Attaches an input event listener to the search input field.
   *
   * This method registers a given handler function to the input event of the search field.
   * The handler is triggered every time the user types in the input field.
   *
   * @param {Function} handler - The callback function to be executed when the input event is fired.
   *
   */

  addHandlerSearch(handler) {
    this._parentElement
      .querySelector('.form__container__form__input')
      .addEventListener('input', handler);
  }
}

export default new SearchView();
