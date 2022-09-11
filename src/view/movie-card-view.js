import {createElement} from '../render.js';
import { formatDateToYear, formatMinutesToTime, defineGenresDescrition } from '../mock/utils.js';
import { MovieDescriptionLength } from '../mock/const.js';

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


export default class MovieCardView {
  constructor(movie, comments, onDetails) {
    this.movie = movie;
    this.comments = comments;
    this.onDetails = onDetails;
  }

  getTemplate() {
    return createMovieCardTemplate(this.movie, this.comments);
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemplate());
      this.element.querySelector('a').addEventListener('click', (evt) => {
        evt.preventDefault();
        this.onDetails(this.movie, this.comments);
      });
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
