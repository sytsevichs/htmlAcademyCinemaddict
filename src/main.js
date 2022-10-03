import MoviesModel from './model/movies-model.js';
import BodyPresenter from './presenter/body-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';
import MoviesApiService from './api/movies-api-service.js';
import {END_POINT } from './utils/const.js';
import { authorization } from './utils/utils.js';

const moviesModel = new MoviesModel(new MoviesApiService(END_POINT,authorization));
moviesModel.init();

const bodyPresenter = new BodyPresenter(moviesModel);
bodyPresenter.init();

const boardPresenter = new BoardPresenter(bodyPresenter.container,moviesModel);
boardPresenter.init();
