import AbstactView from '../../framework/view/abstract-view.js';

const createUserRankTemplate = () => (`<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`);

export default class UserRankView extends AbstactView {
  get template() {
    return createUserRankTemplate();
  }
}