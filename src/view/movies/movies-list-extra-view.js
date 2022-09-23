import AbstactView from '../../framework/view/abstract-view.js';

const createMoviesListExtraView = () => (
  `<section class="films-list films-list--extra">
  </section>`
);
export default class MoviesListExtraView extends AbstactView {
  get template() {
    return createMoviesListExtraView();
  }
}
