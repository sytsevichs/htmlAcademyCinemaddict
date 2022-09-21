import AbstactView from '../framework/view/abstract-view.js';

const createMoviesContainerView = () => ('<div class="films-list__container"></div>');

export default class MoviesContainerView extends AbstactView {
  get template() {
    return createMoviesContainerView();
  }
}
