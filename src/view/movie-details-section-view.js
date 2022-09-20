import AbstactView from '../framework/view/abstract-view.js';

const createMovieDetailsSectionTemplate = () => ('<section class="film-details"></section>');
export default class MovieDetailsSectionView extends AbstactView {
  get template() {
    return createMovieDetailsSectionTemplate();
  }
}
