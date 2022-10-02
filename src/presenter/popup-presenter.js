import { remove, render, replace } from '../framework/render.js';
import MovieDetailsSectionView from '../view/popup/movie-details-section-view.js';
import MovieDetailsTopInfoView from '../view/popup/movie-details-top-info-view.js';
import MovieDetailsTopContainerView from '../view/popup/movie-details-top-container-view.js';
import MovieDetailsBottomContainerView from '../view/popup/movie-details-bottom-container-view.js';
import MovieDetailsCloseButtomView from '../view/popup/movie-details-close-button-view.js';
import MovieDetailsTopControlsView from '../view/popup/movie-details-top-controls-view.js';
import MovieDetailsInnerView from '../view/popup/movie-details-inner-view.js';
import bodyView from '../view/body/body-view.js';
import { isEscapeKey, updateItemByName } from '../utils/utils.js';
import { AUTHORITHATION, END_POINT, UpdateType, UserAction } from '../utils/const.js';
import CommentsApiService from '../api/comments-api-service.js';
import CommentsModel from '../model/comments-model.js';

export default class PopupPresenter {
  #movie;
  #comments;
  #handleMovieControlChange;
  #handleCommentsViewEvent;
  #detailsElement;
  #bodyComponent = new bodyView();
  #movieDetailsSectionComponent = new MovieDetailsSectionView();
  #movieDetailsInnerComponent = new MovieDetailsInnerView();
  #movieDetailsTopContainerComponent = new MovieDetailsTopContainerView();
  #movieDetailsTopControlsComponent = null;
  #movieDetailsTopInfoComponent;
  #movieDetailsBottomContainerComponent = null;
  #updateMovieComments;
  #movieCommentsModel;

  constructor(movie,handleMovieControlChange, handleCommentsViewEvent, updateMovieComments) {
    this.#movie = movie;
    this.#handleMovieControlChange = handleMovieControlChange;
    this.#handleCommentsViewEvent = handleCommentsViewEvent;
    this.#updateMovieComments = updateMovieComments;
  }

  init = () => {
    this.#closeDetailsView();
    //Получаем комментарии к фильму
    this.#initComments(this.#movie.id);
    this.#renderTopContainer(this.#movieDetailsInnerComponent.element);
    this.#renderBottomContainer(this.#movieDetailsInnerComponent.element);
    render( this.#movieDetailsInnerComponent, this.#movieDetailsSectionComponent.element);
    this.#setEscapeListener();

  };

  #renderDetailsTopInfo = () => {
    this.#movieDetailsTopInfoComponent = new MovieDetailsTopInfoView(this.#movie);
  };

  #renderCloseButton = () => {
    const movieDetailsCloseButtonComponent = new MovieDetailsCloseButtomView;
    render(movieDetailsCloseButtonComponent, this.#movieDetailsTopInfoComponent.element);
    movieDetailsCloseButtonComponent.setClickHandler(this.#closeDetailsView);
    this.#detailsElement = this.#movieDetailsSectionComponent.element;
    this.#bodyComponent.element.appendChild(this.#detailsElement);
    this.#bodyComponent.show();
  };

  #renderTopContainer = (container) => {
    this.#renderDetailsTopInfo(this.#movie);
    this.#renderCloseButton();

    render(this.#movieDetailsTopInfoComponent, this.#movieDetailsTopContainerComponent.element);

    this.#renderControls(this.#movie.controls, this.#movieDetailsTopContainerComponent.element);

    render(this.#movieDetailsTopContainerComponent,container);
  };

  #renderControls = (controls, container) => {
    const prevMovieDetailsTopControlsComponent = this.#movieDetailsTopControlsComponent;
    this.#movieDetailsTopControlsComponent = new MovieDetailsTopControlsView(controls);
    this.#movieDetailsTopControlsComponent.setClickHandler(this.#changeMovieControl);

    if ( prevMovieDetailsTopControlsComponent === null || this.#movieDetailsTopControlsComponent === null ) {
      render(this.#movieDetailsTopControlsComponent, container);
      return;
    }

    if (container.contains(prevMovieDetailsTopControlsComponent.element)) {
      replace(this.#movieDetailsTopControlsComponent, prevMovieDetailsTopControlsComponent);
    }

    remove(prevMovieDetailsTopControlsComponent);

  };

  #renderBottomContainer = (container) => {
    this.#comments = [...this.#movieCommentsModel.comments];
    const prevMovieDetailsBottomContainerComponent = this.#movieDetailsBottomContainerComponent;
    this.#movieDetailsBottomContainerComponent = new MovieDetailsBottomContainerView(this.#movie.id, this.#comments);
    this.#movieDetailsBottomContainerComponent.setHandlers(this.#handleCommentsViewEvent);

    if ( prevMovieDetailsBottomContainerComponent === null || this.#movieDetailsBottomContainerComponent === null ) {
      render(this.#movieDetailsBottomContainerComponent, container);
      return;
    }

    if (container.contains(prevMovieDetailsBottomContainerComponent.element)) {
      replace(this.#movieDetailsBottomContainerComponent, prevMovieDetailsBottomContainerComponent);
    }

    remove(prevMovieDetailsBottomContainerComponent);
  };

  #closeDetailsView = () => {
    if (this.#detailsElement) {
      this.#detailsElement.remove();
      this.#bodyComponent.hide();
    }
  };

  #changeMovieControl = (control) => {
    control.active = !control.active;
    this.#movie.controls = updateItemByName(this.#movie.controls, control);
    this.#handleMovieControlChange(UserAction.UPDATE, UpdateType.PATCH, this.#movie);
  };

  #setEscapeListener = () => {
    document.addEventListener('keydown', (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        this.#closeDetailsView();
      }
    });
  };

  #initComments = (id) => {
    this.#movieCommentsModel = new CommentsModel(id, new CommentsApiService(id, END_POINT, AUTHORITHATION));
    this.#movieCommentsModel.init();
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

  updateBottomContainer = () => {
    this.#renderBottomContainer(this.#movieDetailsInnerComponent.element);
  };

  closeDetailsView = () => this.#closeDetailsView();

  updateControls = (controls) => {
    this.#renderControls(controls, this.#movieDetailsTopContainerComponent.element);
  };
}
