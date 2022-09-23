import AbstactView from '../../framework/view/abstract-view.js';
import { formatDateToYear, formatMinutesToTime, defineGenresDescrition } from '../../utils/utils.js';
import { MovieDescriptionLength } from '../../utils/const.js';

const createMovieCardTemplate = (movie, comments) => {
  const {filmInfo} = movie;
  const date = formatDateToYear(filmInfo.release.date);
  const duration = formatMinutesToTime(filmInfo.runtime);
  const description = filmInfo.description.length > MovieDescriptionLength.max ? `${filmInfo.description.substr(MovieDescriptionLength.min,MovieDescriptionLength.max)}...` : filmInfo.description;
  const commentsText = comments.length === 1 ? 'comment' : 'comments';

  return (`<article class="film-card">
             <a class="film-card__link">
                <h3 class="film-card__title">${filmInfo.title}</h3>
                <p class="film-card__rating">${filmInfo.totalRating}</p>
                <p class="film-card__info">
                  <span class="film-card__year">${date}</span>
                  <span class="film-card__duration">${duration}</span><br>
                  <span class="film-card__genre">${defineGenresDescrition(filmInfo.genre.length)} ${filmInfo.genre}</span>
                </p>
                <img src=${filmInfo.poster} alt="" class="film-card__poster">
                <p class="film-card__description">${description}</p>
                <span class="film-card__comments">${comments.length > 0 ? `${comments.length} ${commentsText}` : 'No comments'}</span>
              </a>
              <div class="film-card__controls">
                  <button class="film-card__controls-item film-card__controls-item--add-to-watchlist" type="button">Add to watchlist</button>
                  <button class="film-card__controls-item film-card__controls-item--mark-as-watched" type="button">Mark as watched</button>
                  <button class="film-card__controls-item film-card__controls-item--favorite" type="button">Mark as favorite</button>
              </div>
            </article>`);
};


export default class MovieCardView extends AbstactView {
  #movie;
  #comments;

  constructor(movie, comments) {
    super();
    this.#movie = movie;
    this.#comments = comments;
  }

  get template() {
    return createMovieCardTemplate(this.#movie, this.#comments);
  }

  setClickHandler = (callback) => {
    this._callback.click = callback;
    this.element.querySelector('a').addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(this.#movie, this.#comments);
  };
}
