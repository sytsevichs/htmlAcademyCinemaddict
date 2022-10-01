import { remove, render, replace } from '../framework/render.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import CommentsModel from '../model/comments-model.js';
import MovieCardContainerView from '../view/movies/movie-card-container-view.js';
import MovieCardControlsView from '../view/movies/movie-card-controls-view.js';
import { updateItemByName } from '../utils/utils.js';
import { UpdateType, UserAction } from '../utils/const.js';
export default class MoviePresenter {
  #movie;
  #container;
  #showMovieDetails;
  #handleMovieControlChange;
  #updateMovieComments;
  #movieCardContainer = new MovieCardContainerView();
  #movieCommentsModel;
  #movieComments;
  #movieCardView = null;
  #movieCardControlsView = null;

  constructor(movie, container,showMovieDetails,handleMovieControlChange, updateMovieComments) {
    this.#movie = movie;
    this.#container = container;
    this.#showMovieDetails = showMovieDetails;
    this.#handleMovieControlChange = handleMovieControlChange;
    this.#updateMovieComments = updateMovieComments;
  }

  init = () => {
    //Получаем комментарии к фильму
    this.#getComments(this.#movie.id);
    //Отрисовка данных карточки
    this.#renderData(this.#movieCardContainer.element);
    //Отрисовка управляющих элементов фильма
    this.#renderControls(this.#movieCardContainer.element);
    render(this.#movieCardContainer,this.#container);
  };

  destroy = () => {
    remove(this.#movieCardView);
    remove(this.#movieCardControlsView);
    remove(this.#movieCardContainer);
  };

  updateControls = () => {
    this.#renderControls(this.#movieCardContainer.element);
  };

  #getComments = (id) => {
    this.#movieCommentsModel = new CommentsModel(id);
    this.#movieComments = [...this.#movieCommentsModel.comments];
    //Оформляем подписку на изменение модели комментариев
    this.#movieCommentsModel.addObserver(this.#updateMovieComments);
  };

  // обработчик событий изменения отоборажения комментариев
  updateCommentsModel = (actionType, updateType, comment) => {
    switch (actionType) {
      case UserAction.ADD:
        this.#movieCommentsModel.addComment(updateType, comment);
        break;
      case UserAction.DELETE:
        this.#movieCommentsModel.deleteComment(updateType, comment);
        break;
    }
  };

  updateData = (comments) => {
    this.#movieComments = comments;
    this.#movieCommentsModel.comments = this.#movieComments;
    this.#renderData(this.#movieCardContainer.element);
  };

  #renderData = (container) => {
    const prevMovieCardView = this.#movieCardView;
    this.#movieCardView = new MovieCardView(this.#movie, this.#movieComments );
    this.#movieCardView.setClickHandler(this.#showMovieDetails);

    if ( prevMovieCardView === null || this.#movieCardView === null ) {
      render(this.#movieCardView,container);
      return;
    }

    if (container.contains(prevMovieCardView.element)) {
      replace(this.#movieCardView, prevMovieCardView);
    }

    remove(prevMovieCardView);
  };

  #renderControls = (container) => {
    const prevMovieCardControlsView = this.#movieCardControlsView;
    this.#movieCardControlsView = new MovieCardControlsView(this.#movie.controls);
    this.#movieCardControlsView.setClickHandler(this.#changeMovieControl);

    if ( prevMovieCardControlsView === null || this.#movieCardControlsView === null ) {
      render(this.#movieCardControlsView,container);
      return;
    }

    if (container.contains(prevMovieCardControlsView.element)) {
      replace(this.#movieCardControlsView, prevMovieCardControlsView);
    }

    remove(prevMovieCardControlsView);
  };

  #changeMovieControl = (control) => {
    control.active = !control.active;
    this.#movie.controls = updateItemByName(this.#movie.controls, control);
    this.#handleMovieControlChange(UserAction.UPDATE, UpdateType.PATCH, this.#movie);
  };

}
