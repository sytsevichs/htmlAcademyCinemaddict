import MoviesModel from './model/movies-model.js';
import Presenter from './presenter/presenter.js';
import {render} from './render.js';
import FilterNavigationView from './view/filter-navigation-view.js';
import FooterStatistics from './view/footer-statistics-view.js';
import SortView from './view/sort-view.js';
import UserRankView from './view/user-rank-view.js';

const bodyElement = document.querySelector('body');
const headerElement = bodyElement.querySelector('.header__logo');
const mainElement = bodyElement.querySelector('main');
const footerElement = bodyElement.querySelector('.footer__statistics');

render (new UserRankView, headerElement);
render (new FilterNavigationView, mainElement);
render (new SortView, mainElement);
render (new FooterStatistics, footerElement);

const moviesModel = new MoviesModel();
const presenter = new Presenter;
presenter.init(mainElement,moviesModel);
