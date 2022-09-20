import bodyView from '../view/body/body-view.js';
import FooterStatisticsView from '../view/body/footer-statistics-view.js';
import UserRankView from '../view/body/user-rank-view.js';
import {render} from '../framework/render.js';

export default class BodyPresenter {
  #userRank = new UserRankView();
  #footerStatisticsView = new FooterStatisticsView();
  #bodyBuilder = new bodyView();

  init = () => {
    render (this.#userRank, this.#bodyBuilder.element);
    render (this.#footerStatisticsView, this.#bodyBuilder.element);
  };

  get container() {
    return this.#bodyBuilder.main;
  }
}
