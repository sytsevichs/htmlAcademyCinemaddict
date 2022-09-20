
import { render } from '../framework/render.js';
import { isEscapeKey } from '../mock/utils.js';
import { MOVIES_NUMBER_PER_STEP } from '../mock/const.js';
import bodyView from '../view/body/body-view.js';
import FilterNavigationView from '../view/filter-navigation-view.js';
import SortView from '../view/sort-view.js';
import MovieCardView from '../view/movie-card-view.js';
import MoviesContainerView from '../view/movies-container-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesListMesssageView from '../view/movies-list-message-view.js';
import MoviesView from '../view/movies-view.js';
import MovieDetailsSectionView from '../view/movie-details-section-view.js';
import CommentsModel from '../model/comments-model.js';
import MovieDetailsTopInfoView from '../view/movie-details-top-info-view.js';
import MovieDetailsTopContainerView from '../view/movie-details-top-container-view.js';
import MovieDetailsBottomContainerView from '../view/movie-details-bottom-container-view.js';
import MovieDetailsCloseButtomView from '../view/movie-details-close-button-view.js';
import MovieDetailsTopControlsView from '../view/movie-details-top-controls-view copy.js';
import MovieDetailsInnerView from '../view/movie-details-inner-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
export default class Presenter {
  #bodyBuilder = new bodyView();
  #movies = new MoviesView();
  #moviesList = new MoviesListView();
  #moviesContainer = new MoviesContainerView();
  #showMoreButton = new ShowMoreButton();
  #boardContainer;
  #moviesModel;
  #boardMovies;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
  #detailsElement;

  init = (container, moviesModel) => {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
    this.#boardMovies = [...this.#moviesModel.movies];

    render (new FilterNavigationView, this.#boardContainer);
    render (new SortView, this.#boardContainer);
    render(this.#movies,this.#boardContainer);
    render(this.#moviesList,this.#movies.element);
    render(new MoviesListMesssageView(this.#boardMovies.length), this.#moviesList.element);
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(this.#boardMovies.length,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(this.#boardMovies[index]);
    });

    if (this.#boardMovies.length > MOVIES_NUMBER_PER_STEP) {
      render(this.#showMoreButton,this.#moviesList.element);
      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };

  #handleShowMoreButtonClick = (evt) => {
    evt.preventDefault();
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_NUMBER_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMoviesCount += MOVIES_NUMBER_PER_STEP;

    if (this.#renderedMoviesCount >= this.#boardMovies.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #renderMovie = (movie)=>{
    const movieComponent = movie;
    const movieCommentsModel = new CommentsModel(movieComponent.id);
    const movieComments = [...movieCommentsModel.comments];
    const movieCardView = new MovieCardView(movieComponent,movieComments);
    movieCardView.setClickHandler(this.#showMovieDetails);
    render(movieCardView,this.#moviesContainer.element);
  };

  #closeDetailsView = () => {
    if (this.#detailsElement) {
      this.#detailsElement.remove();
      this.#bodyBuilder.hide();
    }
  };

  #showMovieDetails = (movie,comments) => {
    this.#closeDetailsView();

    const movieDetailsSection = new MovieDetailsSectionView;
    const movieDetailsInnerView = new MovieDetailsInnerView;
    const movieDetailsTopContainer = new MovieDetailsTopContainerView;
    const movieDetailsBottomContainer = new MovieDetailsBottomContainerView(comments);
    const movieDetailsCloseButton = new MovieDetailsCloseButtomView;
    const movieDetailsTopInfo = new MovieDetailsTopInfoView(movie);
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
}
