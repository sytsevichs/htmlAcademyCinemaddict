import AbstactView from '../framework/view/abstract-view.js';

const createMoviesView = () => ('<section class="films"></section>');

export default class MoviesView extends AbstactView {
  get template() {
    return createMoviesView();
  }
}
