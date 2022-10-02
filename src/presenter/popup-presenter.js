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
import { UpdateType, UserAction } from '../utils/const.js';

export default class PopupPresenter {
  #movie;
  #comments;
  #handleMovieControlChange;
  #handleCommentsViewEvent;
  #detailsElement;
  #bodyBuilder = new bodyView();
  #movieDetailsSection = new MovieDetailsSectionView();
  #movieDetailsInnerView = new MovieDetailsInnerView();
  #movieDetailsTopContainer = new MovieDetailsTopContainerView();
  #movieDetailsTopControls = null;
  #movieDetailsTopInfo;
  #movieDetailsBottomContainer;

  constructor(movie,comments,handleMovieControlChange, handleCommentsViewEvent) {
    this.#movie = movie;
    this.#comments = comments;
    this.#handleMovieControlChange = handleMovieControlChange;
    this.#handleCommentsViewEvent = handleCommentsViewEvent;
  }

  init = () => {
    this.#closeDetailsView();

    this.#renderTopContainer(this.#movieDetailsInnerView.element);
    this.#renderBottomContainer(this.#movieDetailsInnerView.element);
    render( this.#movieDetailsInnerView, this.#movieDetailsSection.element);
    this.#setEscapeListener();

  };

  closeDetailsView = () => this.#closeDetailsView();

  updateControls = (controls) => {
    this.#renderControls(controls, this.#movieDetailsTopContainer.element);
  };

  #renderDetailsTopInfo = () => {
    this.#movieDetailsTopInfo = new MovieDetailsTopInfoView(this.#movie);
  };

  #renderCloseButton = () => {
    const movieDetailsCloseButton = new MovieDetailsCloseButtomView;
    render(movieDetailsCloseButton, this.#movieDetailsTopInfo.element);
    movieDetailsCloseButton.setClickHandler(this.#closeDetailsView);
    this.#detailsElement = this.#movieDetailsSection.element;
    this.#bodyBuilder.element.appendChild(this.#detailsElement);
    this.#bodyBuilder.show();
  };

  #renderTopContainer = (container) => {
    this.#renderDetailsTopInfo(this.#movie);
    this.#renderCloseButton();

    render(this.#movieDetailsTopInfo, this.#movieDetailsTopContainer.element);

    this.#renderControls(this.#movie.controls, this.#movieDetailsTopContainer.element);

    render(this.#movieDetailsTopContainer,container);
  };

  #renderControls = (controls, container) => {
    const prevMovieDetailsTopControls = this.#movieDetailsTopControls;
    this.#movieDetailsTopControls = new MovieDetailsTopControlsView(controls);
    this.#movieDetailsTopControls.setClickHandler(this.#changeMovieControl);

    if ( prevMovieDetailsTopControls === null || this.#movieDetailsTopControls === null ) {
      render(this.#movieDetailsTopControls, container);
      return;
    }

    if (container.contains(prevMovieDetailsTopControls.element)) {
      replace(this.#movieDetailsTopControls, prevMovieDetailsTopControls);
    }

    remove(prevMovieDetailsTopControls);

  };

  #renderBottomContainer = (container) => {
    this.#movieDetailsBottomContainer = new MovieDetailsBottomContainerView(this.#movie.id, this.#comments);
    this.#movieDetailsBottomContainer.setHandlers(this.#handleCommentsViewEvent);
    render(this.#movieDetailsBottomContainer, container);
  };

  #closeDetailsView = () => {
    if (this.#detailsElement) {
      this.#detailsElement.remove();
      this.#bodyBuilder.hide();
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


}
