import AbstactView from '../../framework/view/abstract-view.js';
import { ACTIVE_CONTROL, CONTROL_TYPES} from '../../utils/const.js';

const createMovieCardControlsTemplate = (controls) => (`
  <div class="film-card__controls">
     ${Object.values(controls).map((control)=>`<button 
       class="film-card__controls-item film-card__controls-item--${control.name} ${ control.active ? `film-card__controls-item--${ACTIVE_CONTROL}` : ' ' } 
        type="button">${control.text}</button>`)}
      </div>`);

export default class MovieCardControlsView extends AbstactView {
  #controls;

  constructor(controls) {
    super();
    this.#controls = controls;
  }

  get template() {
    return createMovieCardControlsTemplate(this.#controls);
  }

  setClickHandler = (callback) => {
    this._callback.button = callback;
    this.element.querySelector('.film-card__controls-item--watchlist').addEventListener('click', this.#watchListHandler);
    this.element.querySelector('.film-card__controls-item--watched').addEventListener('click', this.#watchedHandler);
    this.element.querySelector('.film-card__controls-item--favorite').addEventListener('click', this.#favoriteHandler);
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
