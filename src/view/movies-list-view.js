import { createElement } from '../render.js';

const createMoviesListView = () => (
  `<section class="films-list">
  </section>`
);

export default class MoviesListView {
  #element;

  getTemplate() {
    return createMoviesListView();
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
