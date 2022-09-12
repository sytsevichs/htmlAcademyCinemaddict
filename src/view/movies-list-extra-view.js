import { createElement } from '../render.js';

const createMoviesListExtraView = () => (
  `<section class="films-list films-list--extra">
  </section>`
);

export default class MoviesListExtraView {
  getTemplate() {
    return createMoviesListExtraView();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
