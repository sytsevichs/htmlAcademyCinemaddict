import AbstactView from '../../framework/view/abstract-view.js';
import { FilterType } from '../../utils/const.js';
import { filterData } from '../../utils/filter.js';

const WATCHED = {
  NOVICE: {name: 'Novice', to:10},
  FAN: {name: 'Fan', from:10, to:20},
  BUF: {name: 'Movie Buf', from: 20},
};

const getUserStatus = (movies) => {
  if (filterData[FilterType.history](movies).length <= WATCHED.FAN.from) {
    return WATCHED.NOVICE.name;
  }
  if (filterData[FilterType.history](movies).length > WATCHED.FAN.to) {
    return WATCHED.BUF.name;
  }
  return WATCHED.FAN.name;
};

const createUserRankTemplate = (movies) => (`<section class="header__profile profile">
    <p class="profile__rating">${getUserStatus(movies)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);

export default class UserRankView extends AbstactView {
  #movies;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get template() {
    return createUserRankTemplate(this.#movies);
  }
}
