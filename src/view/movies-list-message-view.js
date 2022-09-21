import AbstactView from '../framework/view/abstract-view.js';

const createMoviesListMesssageView = (moviesCount) => (
  `${moviesCount ? '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>' : '<h2 class="films-list__title">There are no movies in our database</h2>'}`
);

export default class MoviesListMesssageView extends AbstactView {
  #moviesCount;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createMoviesListMesssageView(this.#moviesCount);
  }
}
