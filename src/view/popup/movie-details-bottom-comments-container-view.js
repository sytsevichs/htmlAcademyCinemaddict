import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';

const createMovieDetailsBottomCommentsContainerTemplate = () => (
  `<section class="film-details__comments-wrap">
   </section>`
);

export default class MovieDetailsBottomCommentsContainerView extends AbstractStatefulView {

  get template() {
    return createMovieDetailsBottomCommentsContainerTemplate(this._state);
  }
}
