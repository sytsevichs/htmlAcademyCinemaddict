
import { render,remove, replace } from '../framework/render.js';
import { MOVIES_NUMBER_PER_STEP, SortType } from '../utils/const.js';
import { generateFilter } from '../mock/filter.js';
import FilterNavigationView from '../view/filter-navigation-view.js';
import SortView from '../view/sort-view.js';
import MoviesContainerView from '../view/movies/movies-container-view.js';
import MoviesListView from '../view/movies/movies-list-view.js';
import MoviesListMesssageView from '../view/movies/movies-list-message-view.js';
import MoviesView from '../view/movies/movies-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { sortByDateUp, sortByDateDown, sortByRatingUp, sortByRatingDown } from '../utils/utils.js';

export default class BoardPresenter {
  #movies = new MoviesView();
  #moviesList = new MoviesListView();
  #moviesContainer = new MoviesContainerView();
  #showMoreButton = new ShowMoreButton();
  #sortComponent;
  #boardContainer;
  #moviesModel;
  #boardMovies;
  #moviesLength;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
  #filters;
  #moviesPresenter = new Map();
  #popupPresenter;
  #popupMovieId = null;
  #filtersNavigation = null;
  #currentSortType = null;
  #newSortType = null;
  #currentSortDirection = true;

  constructor(container, moviesModel) {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#renderBoard();
  };

  #renderBoard = () => {
    this.#renderFilters();
    this.#renderSorting();
    this.#renderMoviesList();
  };

  #renderFilters = () => {
    this.#filters = generateFilter(this.#moviesModel.movies);
    const prevfiltersNavigation = this.#filtersNavigation;
    this.#filtersNavigation = new FilterNavigationView(this.#filters);

    if ( prevfiltersNavigation === null || this.#filtersNavigation === null ) {
      render(this.#filtersNavigation, this.#boardContainer);
      return;
    }

    if (this.#boardContainer.contains(prevfiltersNavigation.element)) {
      replace(this.#filtersNavigation, prevfiltersNavigation);
    }
    remove(prevfiltersNavigation);
  };

  #renderSorting = () => {
    this.#currentSortType = SortType.DEFAULT;
    this.#sortComponent = new SortView(this.#currentSortType);
    render(this.#sortComponent, this.#boardContainer);
    this.#sortComponent.setClickHandler(this.#handleSortingChange);
  };

  #changeSorting = () => {
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView(this.#newSortType);
    render(this.#sortComponent, this.#boardContainer);

    if (this.#boardContainer.contains(prevSortComponent.element)) {
      replace(this.#sortComponent, prevSortComponent);
    }

    remove(prevSortComponent);
    this.#sortComponent.setClickHandler(this.#handleSortingChange);
  };

  #handleSortingChange = (sortType) => {
    if (this.#newSortType !== sortType ) {
      this.#newSortType = sortType;
      this.#changeSorting();
    }
    this.#clearMoviesList();
    this.#renderMoviesList();
  };


  get movies() {
    if (this.#currentSortType === this.#newSortType) {
      this.#currentSortDirection = !this.#currentSortDirection;
    } else {
      this.#currentSortDirection = true;
    }
    this.#currentSortType = this.#newSortType;

    switch (this.#newSortType) {
      case SortType.DATE:
        if (this.#currentSortDirection) {
          return [...this.#moviesModel.movies].sort(sortByDateUp);
        } else {
          return [...this.#moviesModel.movies].sort(sortByDateDown);
        }
      case SortType.RATING:
        if (this.#currentSortDirection) {
          return [...this.#moviesModel.movies].sort(sortByRatingDown);
        } else {
          return [...this.#moviesModel.movies].sort(sortByRatingUp);
        }
      default:
        return [...this.#moviesModel.movies];
    }
  }

  #renderMoviesList = () => {
    this.#renderMoviesContainer();
    //Запоминаем и выводим сортированный список
    this.#boardMovies = this.movies;
    this.#renderMoviesListMessage();
    this.#renderMovies(this.#boardMovies);
  };

  #renderMoviesContainer = () => {
    render(this.#movies,this.#boardContainer);
    render(this.#moviesList,this.#movies.element);
  };

  #renderMoviesListMessage = () => {
    this.#moviesLength = this.#boardMovies.length;
    render(new MoviesListMesssageView(this.#moviesLength), this.#moviesList.element);
  };

  #renderMovies = (movies) => {
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(this.#moviesLength,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(movies[index]);
    });

    this.#renderShowMoreButton();
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(movie, this.#moviesContainer.element, this.#showMovieDetails, this.#handleMovieControlChange);
    moviePresenter.init();
    this.#moviesPresenter.set(movie.id, moviePresenter);
  };

  #renderShowMoreButton = () => {
    if (this.#moviesLength > MOVIES_NUMBER_PER_STEP) {
      render(this.#showMoreButton,this.#moviesList.element);
      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_NUMBER_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMoviesCount += MOVIES_NUMBER_PER_STEP;

    if (this.#renderedMoviesCount >= this.#moviesLength) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #showMovieDetails = (movie,comments) => {
    this.#popupMovieId = movie.id;
    if (this.#popupPresenter) {
      this.#popupPresenter.closeDetailsView();
    }
    this.#popupPresenter = new PopupPresenter(movie, comments, this.#handleMovieControlChange, this.#handleMovieComments);
    this.#popupPresenter.init();
  };

  #handleMovieControlChange = (movie,controls) => {
    this.#moviesPresenter.get(movie.id).updateControls();
    if (this.#popupMovieId === movie.id) {
      this.#popupPresenter.updateControls(controls);
    }
    this.#moviesModel.updateSingleMovie(movie);
    this.#renderFilters();
  };

  #handleMovieComments = (movieId,comments) => {
    this.#moviesPresenter.get(movieId).updateData(comments);
  };

  #clearMoviesList = () => {
    this.#moviesPresenter.forEach((presenter) => presenter.destroy());
    this.#moviesPresenter.clear();
    this.#renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
    remove(this.#showMoreButton);
  };

}
