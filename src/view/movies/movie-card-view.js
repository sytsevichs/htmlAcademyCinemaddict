import AbstactView from '../../framework/view/abstract-view.js';
import { formatDateToYear, formatMinutesToTime, defineGenresDescription } from '../../utils/utils.js';
import {MovieDescriptionLength } from '../../utils/const.js';
import he from 'he';

const createMovieCardTemplate = (movie, comments) => {
  const {filmInfo} = movie;
  const date = formatDateToYear(filmInfo.release.date);
  const duration = formatMinutesToTime(filmInfo.runtime);
  const description = filmInfo.description.length > MovieDescriptionLength.max ? `${filmInfo.description.substr(MovieDescriptionLength.min,MovieDescriptionLength.max)}...` : filmInfo.description;
  const commentsText = comments.length === 1 ? 'comment' : 'comments';
  return (`<a class="film-card__link">
             <h3 class="film-card__title">${filmInfo.title}</h3>
             <p class="film-card__rating">${filmInfo.totalRating}</p>
             <p class="film-card__info">
               <span class="film-card__year">${date}</span>
               <span class="film-card__duration">${duration}</span><br>
               <span class="film-card__genre">${defineGenresDescription(filmInfo.genre.length)} ${Object.values(filmInfo.genre).join(', ')}</span>
             </p>
             <img src=${filmInfo.poster} alt="" class="film-card__poster">
             <p class="film-card__description">${description}</p>
             <span class="film-card__comments">${comments.length > 0 ? `${comments.length} ${he.encode(commentsText)}` : 'No comments'}</span>
           </a>`);
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
    this.element.addEventListener('click', this.#clickHandler);
  };

  #clickHandler = (evt) => {
    evt.preventDefault();
    this._callback.click(this.#movie);
  };

}
