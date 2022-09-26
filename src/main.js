import BodyPresenter from './presenter/body-presenter.js';
import BoardPresenter from './presenter/board-presenter.js';

const bodyPresenter = new BodyPresenter();
bodyPresenter.init();

const boardPresenter = new BoardPresenter(bodyPresenter.container);

boardPresenter.init();
