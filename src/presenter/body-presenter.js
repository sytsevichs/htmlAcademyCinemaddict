import BodyView from '../view/body/body-view.js';
import FooterStatisticsView from '../view/body/footer-statistics-view.js';
import UserRankView from '../view/body/user-rank-view.js';
import {render,replace,remove} from '../framework/render.js';
import { MoviesUpdateGroup } from '../utils/const.js';

export default class BodyPresenter {
  #moviesModel;
  #bodyComponent = new BodyView();
  #userRankComponent = null;
  #footerStatisticsComponent = null;

  constructor(moviesModel) {
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#moviesModel.addObserver(this.#updateBodyInfo, MoviesUpdateGroup.ALL);
    this.#moviesModel.addObserver(this.#updateBodyInfo, MoviesUpdateGroup.SINGLE);
    this.#renderUserRank();
    this.#renderFooterStatistics();
  };


  #renderUserRank = () => {
    const prevUserRankComponent = this.#userRankComponent;
    this.#userRankComponent = new UserRankView(this.#moviesModel.movies);

    if ( prevUserRankComponent === null || this.#userRankComponent === null ) {
      render(this.#userRankComponent, this.#bodyComponent.header);
      return;
    }

    if (this.#bodyComponent.header.contains(prevUserRankComponent.element)) {
      replace(this.#userRankComponent, prevUserRankComponent);
    }

    remove(prevUserRankComponent);
  };

  #renderFooterStatistics = () => {
    const prevFooterStatisticsComponent = this.#footerStatisticsComponent;
    this.#footerStatisticsComponent = new FooterStatisticsView(this.#moviesModel.movies.length);

    if ( prevFooterStatisticsComponent === null || this.#footerStatisticsComponent === null ) {
      render(this.#footerStatisticsComponent, this.#bodyComponent.footer);
      return;
    }

    if (this.#bodyComponent.footer.contains(prevFooterStatisticsComponent.element)) {
      replace(this.#footerStatisticsComponent, prevFooterStatisticsComponent);
    }

    remove(prevFooterStatisticsComponent);
  };

  #updateBodyInfo = () => {
    this.#renderUserRank();
    this.#renderFooterStatistics();
  };

  get container() {
    return this.#bodyComponent.main;
  }
}
