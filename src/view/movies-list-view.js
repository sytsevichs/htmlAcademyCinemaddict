import AbstactView from '../framework/view/abstract-view.js';

const createMoviesListView = () => (
  `<section class="films-list">
  </section>`
);

export default class MoviesListView extends AbstactView {
  get template() {
    return createMoviesListView();
  }
}
