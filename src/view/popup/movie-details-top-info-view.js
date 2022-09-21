import AbstactView from '../../framework/view/abstract-view.js';
import {
  formatDateDescription,
  formatMinutesToTime,
  defineGenresDescrition
} from '../../mock/utils.js';

const createMovieDetailsTopInfoTemplate = (movie) => {
  const {
    filmInfo
  } = movie;

  const date = formatDateDescription(filmInfo.release.date);
  const duration = formatMinutesToTime(filmInfo.runtime);

  return (`<div class="film-details__info-wrap">
      <div class="film-details__poster">
        <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

        <p class="film-details__age">${filmInfo.ageRating}</p>
      </div>

      <div class="film-details__info">
        <div class="film-details__info-head">
          <div class="film-details__title-wrap">
            <h3 class="film-details__title">${filmInfo.title}</h3>
            <p class="film-details__title-original">Original: ${filmInfo.alternativeTitle}</p>
          </div>

          <div class="film-details__rating">
            <p class="film-details__total-rating">${filmInfo.totalRating}</p>
          </div>
        </div>

        <table class="film-details__table">
          <tr class="film-details__row">
            <td class="film-details__term">Director</td>
            <td class="film-details__cell">${filmInfo.director}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Writers</td>
            <td class="film-details__cell">${filmInfo.writers}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Actors</td>
            <td class="film-details__cell">${filmInfo.actors}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Release Date</td>
            <td class="film-details__cell">${date}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Runtime</td>
            <td class="film-details__cell"${duration}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">Country</td>
            <td class="film-details__cell">${filmInfo.release.releaseCountry}</td>
          </tr>
          <tr class="film-details__row">
            <td class="film-details__term">${defineGenresDescrition(filmInfo.genre.length)}</td>
            <td class="film-details__cell">
            ${Object.values(filmInfo.genre).map((genre) => `<span class="film-details__genre">${genre}</span>`)}
            </td>
          </tr>
        </table>

        <p class="film-details__film-description">${filmInfo.description}</p>
      </div>
    </div>`);
};


export default class MovieDetailsTopInfoView extends AbstactView {
  #movie;
  constructor(movie) {
    super();
    this.#movie = movie;
  }

  get template() {
    return createMovieDetailsTopInfoTemplate(this.#movie);
  }
}
