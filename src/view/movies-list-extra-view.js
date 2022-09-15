import { createElement } from '../render.js';

const createMoviesListExtraView = () => (
  `<section class="films-list films-list--extra">
  </section>`
);

export default class MoviesListExtraView {
  #element;
  getTemplate() {
    return createMoviesListExtraView();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }

    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
