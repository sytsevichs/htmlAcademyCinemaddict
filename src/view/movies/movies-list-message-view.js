import AbstactView from '../../framework/view/abstract-view.js';

const createMoviesListMesssageView = (moviesCount,emptyListMessage) => (
  `${moviesCount ? '<h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>' : `<h2 class="films-list__title">${emptyListMessage}</h2>`}`
);

export default class MoviesListMesssageView extends AbstactView {
  #moviesCount;
  #emptyListMessage;

  constructor(moviesCount, emptyListMessage) {
    super();
    this.#moviesCount = moviesCount;
    this.#emptyListMessage = emptyListMessage;
  }

  get template() {
    return createMoviesListMesssageView(this.#moviesCount, this.#emptyListMessage);
  }
}
