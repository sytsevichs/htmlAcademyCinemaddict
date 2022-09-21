import AbstactView from '../../framework/view/abstract-view.js';
const createMovieDetailsCloseButtonTemplate = () => ('div class="film-details__close"><button class="film-details__close-btn" type="button">close</button></div>');

export default class MovieDetailsCloseButtomView extends AbstactView {
  get template() {
    return createMovieDetailsCloseButtonTemplate();
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click();
  };

}
