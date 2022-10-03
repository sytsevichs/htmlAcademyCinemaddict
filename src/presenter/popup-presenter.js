import { remove, render, replace } from '../framework/render.js';
import MovieDetailsSectionView from '../view/popup/movie-details-section-view.js';
import MovieDetailsTopInfoView from '../view/popup/movie-details-top-info-view.js';
import MovieDetailsTopContainerView from '../view/popup/movie-details-top-container-view.js';
import MovieDetailsBottomContainerView from '../view/popup/movie-details-bottom-container-view.js';
import MovieDetailsCloseButtomView from '../view/popup/movie-details-close-button-view.js';
import MovieDetailsTopControlsView from '../view/popup/movie-details-top-controls-view.js';
import MovieDetailsInnerView from '../view/popup/movie-details-inner-view.js';
import bodyView from '../view/body/body-view.js';
import { isEscapeKey, setAborting, updateItemByName } from '../utils/utils.js';
import { AUTHORITHATION, END_POINT, UpdateType, UserAction} from '../utils/const.js';
import CommentsApiService from '../api/comments-api-service.js';
import CommentsModel from '../model/comments-model.js';
import MovieDetailsCommentsView from '../view/popup/movie-details-comments-view.js';
import MovieDetailsNewCommentView from '../view/popup/movie-details-new-comment-view;js';
import MovieDetailsBottomCommentsContainerView from '../view/popup/movie-details-bottom-comments-container-view.js';
export default class PopupPresenter {
  #movie;
  #comments;
  #uiBlocker;
  #handleMovieControlChange;
  #detailsElement;
  #bodyComponent = new bodyView();
  #movieDetailsSectionComponent = new MovieDetailsSectionView();
  #movieDetailsInnerComponent = new MovieDetailsInnerView();
  #movieDetailsTopContainerComponent = new MovieDetailsTopContainerView();
  #movieDetailsTopControlsComponent = null;
  #movieDetailsTopInfoComponent;
  #movieDetailsBottomContainerComponent = null;
  #movieDetailsBottomCommentsContainerComponent = null;
  #movieDetailsCommentsComponent = null;
  #movieDetailsNewCommentComponent = null;
  #updateMovieComments;
  #movieCommentsModel;

  constructor(movie,handleMovieControlChange, updateMovieComments,uiBlocker) {
    this.#movie = movie;
    this.#handleMovieControlChange = handleMovieControlChange;
    this.#updateMovieComments = updateMovieComments;
    this.#uiBlocker = uiBlocker;
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
    this.#movieDetailsBottomContainerComponent = new MovieDetailsBottomContainerView();
    this.#movieDetailsBottomCommentsContainerComponent = new MovieDetailsBottomCommentsContainerView();
    this.#renderComments(this.#movieDetailsBottomCommentsContainerComponent.element);
    this.#renderNewComment(this.#movieDetailsBottomCommentsContainerComponent.element);
    render(this.#movieDetailsBottomCommentsContainerComponent, this.#movieDetailsBottomContainerComponent.element);
    render(this.#movieDetailsBottomContainerComponent, container);
  };

  #renderComments = (container) => {
    this.#comments = [...this.#movieCommentsModel.comments];
    const prevDetailsCommentsComponent = this.#movieDetailsCommentsComponent;
    this.#movieDetailsCommentsComponent = new MovieDetailsCommentsView(this.#movie.id, this.#comments);
    this.#movieDetailsCommentsComponent.setHandlers(this.#handleCommentsViewEvent);

    if ( prevDetailsCommentsComponent === null || this.#movieDetailsCommentsComponent === null ) {
      render(this.#movieDetailsCommentsComponent, container);
      return;
    }

    if (container.contains(prevDetailsCommentsComponent.element)) {
      replace(this.#movieDetailsCommentsComponent, prevDetailsCommentsComponent);
    }

    remove(prevDetailsCommentsComponent);
  };

  #renderNewComment = (container) => {
    const prevDetailsNewCommentComponent = this.#movieDetailsNewCommentComponent;
    this.#movieDetailsNewCommentComponent = new MovieDetailsNewCommentView();
    this.#movieDetailsNewCommentComponent.setHandlers(this.#handleCommentsViewEvent);

    if ( prevDetailsNewCommentComponent === null || this.#movieDetailsNewCommentComponent === null ) {
      render(this.#movieDetailsNewCommentComponent, container);
      return;
    }

    if (container.contains(prevDetailsNewCommentComponent.element)) {
      replace(this.#movieDetailsNewCommentComponent, prevDetailsNewCommentComponent);
    }

    remove(prevDetailsNewCommentComponent);
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
    this.#handleMovieControlChange(UserAction.UPDATE, UpdateType.PATCH, this.#movie, this.#movieDetailsTopControlsComponent);
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
  #handleCommentsViewEvent = async (actionType, updateType, comment) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.ADD:
        try {
          await this.#movieCommentsModel.addComment(updateType, comment);
        } catch (error) {
          setAborting(this.#movieDetailsNewCommentComponent);
        }
        break;
      case UserAction.DELETE:
        try {
          await this.#movieCommentsModel.deleteComment(updateType, comment);
        } catch (error) {
          setAborting(this.#movieDetailsCommentsComponent);
        }
        break;
    }
    this.#uiBlocker.unblock();
  };

  updateBottomContainer = () => {
    this.#uiBlocker.unblock();
    this.#renderComments(this.#movieDetailsBottomCommentsContainerComponent.element);
    this.#renderNewComment(this.#movieDetailsBottomCommentsContainerComponent.element);
  };

  closeDetailsView = () => this.#closeDetailsView();

  updateControls = (controls) => {
    this.#renderControls(controls, this.#movieDetailsTopContainerComponent.element);
  };


}
