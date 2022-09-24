import AbstactView from '../../framework/view/abstract-view.js';
import { ACTIVE_CONTROL, CONTROL_TYPES} from '../../utils/const.js';

const createMovieCardControlsTemplate = (controls) => (`
  <div class="film-card__controls">
     ${Object.values(controls).map((control)=>`<button 
       class="film-card__controls-item film-card__controls-item--${control.name} ${ control.active ? `film-card__controls-item--${ACTIVE_CONTROL}` : ' ' }"
       data-name="${control.name}" type="button">${control.text}</button>`)}
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
    this.element.querySelectorAll('.film-card__controls-item').forEach((button) => button.addEventListener('click', this.#handleButtonClick));
  };

  #handleButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.button(this.#controls[CONTROL_TYPES[evt.target.dataset.name]]);
  };

}
