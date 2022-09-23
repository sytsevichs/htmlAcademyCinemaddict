import MoviesModel from './model/movies-model.js';
import BodyPresenter from './presenter/body-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const bodyPresenter = new BodyPresenter();
bodyPresenter.init();

const moviesModel = new MoviesModel();
const mainPresenter = new MainPresenter(bodyPresenter.container,moviesModel);

mainPresenter.init();
