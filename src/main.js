import MoviesModel from './model/movies-model.js';
import BodyPresenter from './presenter/body-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import MoviesApiService from './api/movies-api-service.js';
import { AUTHORITHATION, END_POINT } from './utils/const.js';

const bodyPresenter = new BodyPresenter();
bodyPresenter.init();

const moviesModel = new MoviesModel(new MoviesApiService(END_POINT,AUTHORITHATION));
moviesModel.init();

const boardPresenter = new BoardPresenter(bodyPresenter.container,moviesModel);
boardPresenter.init();
