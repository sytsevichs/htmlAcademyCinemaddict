import MoviesModel from './model/movies-model.js';
import BodyPresenter from './presenter/body-presenter.js';
import Presenter from './presenter/presenter.js';

const bodyPresenter = new BodyPresenter();
bodyPresenter.init();

const moviesModel = new MoviesModel();
const presenter = new Presenter();

presenter.init(bodyPresenter.container,moviesModel);
