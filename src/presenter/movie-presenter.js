import { render } from '../framework/render.js';
import MovieDetailsSectionView from '../view/popup/movie-details-section-view.js';
import MovieDetailsTopInfoView from '../view/popup/movie-details-top-info-view.js';
import MovieDetailsTopContainerView from '../view/popup/movie-details-top-container-view.js';
import MovieDetailsBottomContainerView from '../view/popup/movie-details-bottom-container-view.js';
import MovieDetailsCloseButtomView from '../view/popup/movie-details-close-button-view.js';
import MovieDetailsTopControlsView from '../view/popup/movie-details-top-controls-view copy.js';
import MovieDetailsInnerView from '../view/popup/movie-details-inner-view.js';
import bodyView from '../view/body/body-view.js';
import { isEscapeKey } from '../utils/utils.js';

export default class MoviePresenter {
  #movie;
  #comments;
  #detailsElement;
  #bodyBuilder = new bodyView();

  constructor(movie,comments) {
    this.#movie = movie;
    this.#comments = comments;
  }

  init = () => {
    this.#closeDetailsView();
    const movieDetailsSection = new MovieDetailsSectionView;
    const movieDetailsInnerView = new MovieDetailsInnerView;
    const movieDetailsTopContainer = new MovieDetailsTopContainerView;
    const movieDetailsBottomContainer = new MovieDetailsBottomContainerView(this.#comments);
    const movieDetailsCloseButton = new MovieDetailsCloseButtomView;
    const movieDetailsTopInfo = new MovieDetailsTopInfoView(this.#movie);
    const movieDetailsTopControls = new MovieDetailsTopControlsView;

    render(movieDetailsCloseButton, movieDetailsTopInfo.element);
    render(movieDetailsTopInfo, movieDetailsTopContainer.element);
    render(movieDetailsTopControls, movieDetailsTopContainer.element);
    render(movieDetailsTopContainer, movieDetailsInnerView.element);
    render(movieDetailsBottomContainer, movieDetailsInnerView.element);
    render(movieDetailsInnerView, movieDetailsSection.element);

    movieDetailsCloseButton.setClickHandler(this.#closeDetailsView);
    this.#detailsElement = movieDetailsSection.element;
    this.#bodyBuilder.element.appendChild(this.#detailsElement);
    this.#bodyBuilder.show();

    //Убрать детали по Escape
    document.addEventListener('keydown', (evt) => {
      if (isEscapeKey(evt)) {
        evt.preventDefault();
        this.#closeDetailsView();
      }
    });
  };

  #closeDetailsView = () => {
    if (this.#detailsElement) {
      this.#detailsElement.remove();
      this.#bodyBuilder.hide();
    }
  };

}
