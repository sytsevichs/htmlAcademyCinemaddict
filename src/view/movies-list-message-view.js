import { createElement } from '../render.js';

const createMoviesListMesssageView = (moviesCount) => (
  `${moviesCount ? '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>' : '<h2 class="films-list__title">There are no movies in our database</h2>'}`
);

export default class MoviesListMesssageView {
  #element;
  #moviesCount;

  constructor(moviesCount) {
    this.#moviesCount = moviesCount;
  }

  getTemplate() {
    return createMoviesListMesssageView(this.#moviesCount);
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
