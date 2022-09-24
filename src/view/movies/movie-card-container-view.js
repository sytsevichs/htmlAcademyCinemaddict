import AbstactView from '../../framework/view/abstract-view.js';

const createMovieCardContainerTemplate = () => ('<article class="film-card"></article>');

export default class MovieCardContainerView extends AbstactView {
  get template() {
    return createMovieCardContainerTemplate();
  }
}
