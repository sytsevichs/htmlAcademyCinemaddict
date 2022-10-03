import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

const createMovieDetailsBottomContainerTemplate = () => (
  `<div class="film-details__bottom-container">
  </div>`
);

export default class MovieDetailsBottomContainerView extends AbstractStatefulView {

  get template() {
    return createMovieDetailsBottomContainerTemplate(this._state);
  }
}
