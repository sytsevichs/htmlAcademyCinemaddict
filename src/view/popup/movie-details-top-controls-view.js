import AbstactView from '../../framework/view/abstract-view.js';
import { ACTIVE_CONTROL, CONTROL_TYPES } from '../../utils/const.js';

const createMovieDetailsToControlsTemplate = (controls) => (`<section class="film-details__controls">
  ${Object.values(controls).map((control)=>`<button 
    type="button" 
    class="film-details__control-button film-details__control-button--${control.name} ${ control.active ? `film-details__control-button--${ACTIVE_CONTROL}` : ' ' }"
    id="${control.name}"  
    name="${control.name}">
    ${control.text}</button>`)
  }
  </section>`);


export default class MovieDetailsTopControlsView extends AbstactView {
  #controls;

  constructor(controls) {
    super();
    this.#controls = controls;
  }

  get template() {
    return createMovieDetailsToControlsTemplate(this.#controls);
  }

  setClickHandler = (callback) => {
    this._callback.button = callback;
    this.element.querySelector('.film-details__control-button--watchlist').addEventListener('click', this.#watchListHandler);
    this.element.querySelector('.film-details__control-button--watched').addEventListener('click', this.#watchedHandler);
    this.element.querySelector('.film-details__control-button--favorite').addEventListener('click', this.#favoriteHandler);
  };

  #watchListHandler = (evt) => {
    evt.preventDefault();
    this._callback.button(this.#controls[CONTROL_TYPES.watchlist]);
  };

  #watchedHandler = (evt) => {
    evt.preventDefault();
    this._callback.button(this.#controls[CONTROL_TYPES.watched]);
  };

  #favoriteHandler = (evt) => {
    evt.preventDefault();
    this._callback.button(this.#controls[CONTROL_TYPES.favorite]);
  };

}
