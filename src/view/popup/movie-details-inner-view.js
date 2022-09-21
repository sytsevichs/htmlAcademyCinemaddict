import AbstactView from '../../framework/view/abstract-view.js';

const createMovieDetailsInnerTemplate = () => ('<div class="film-details__inner">');
export default class MovieDetailsInnerView extends AbstactView {
  get template() {
    return createMovieDetailsInnerTemplate();
  }
}
