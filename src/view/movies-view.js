import { createElement } from '../render.js';

const createMoviesView = () => ('<section class="films"></section>');

export default class MoviesView {
  #element;

  getTemplate() {
    return createMoviesView();
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
