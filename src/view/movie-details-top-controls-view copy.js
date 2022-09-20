import AbstactView from '../framework/view/abstract-view.js';


const createMovieDetailsToControlsTemplate = () => (`<section class="film-details__controls">
      <button type="button" class="film-details__control-button film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
      <button type="button" class="film-details__control-button film-details__control-button--active film-details__control-button--watched" id="watched" name="watched">Already watched</button>
      <button type="button" class="film-details__control-button film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
    </section>`);


export default class MovieDetailsTopControlsView extends AbstactView {
  get template() {
    return createMovieDetailsToControlsTemplate();
  }
}
