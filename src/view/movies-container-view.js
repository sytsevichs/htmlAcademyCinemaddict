import { createElement } from '../render.js';

const createMoviesContainerView = () => ('<div class="films-list__container"></div>');

export default class MoviesContainerView {
  getTemplate() {
    return createMoviesContainerView();
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
