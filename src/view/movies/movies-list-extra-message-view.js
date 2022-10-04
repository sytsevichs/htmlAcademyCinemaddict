import AbstactView from '../../framework/view/abstract-view.js';

const createMoviesExtraListMesssageView = (moviesCount,extraListMessage) => (
  `<h2 class="films-list__title ${moviesCount ? '' : 'visually-hidden'}">${extraListMessage}</h2>`
);

export default class MoviesExtraListMesssageView extends AbstactView {
  #moviesCount;
  #extraListMessage;

  constructor(moviesCount, extraListMessage) {
    super();
    this.#moviesCount = moviesCount;
    this.#extraListMessage = extraListMessage;
  }

  get template() {
    return createMoviesExtraListMesssageView(this.#moviesCount, this.#extraListMessage);
  }
}
