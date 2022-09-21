import AbstactView from '../../framework/view/abstract-view.js';

const createMovieDetailsTopContainerTemplate = () => ('<div class="film-details__top-container"></div>');

export default class MovieDetailsTopContainerView extends AbstactView {
  get template() {
    return createMovieDetailsTopContainerTemplate();
  }
}
