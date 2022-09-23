import MoviesModel from './model/movies-model.js';
import BodyPresenter from './presenter/body-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

const bodyPresenter = new BodyPresenter();
bodyPresenter.init();

const moviesModel = new MoviesModel();
const boardPresenter = new BoardPresenter(bodyPresenter.container,moviesModel);

boardPresenter.init();
