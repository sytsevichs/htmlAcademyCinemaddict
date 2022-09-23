
import { render,remove, replace } from '../framework/render.js';
import { MOVIES_NUMBER_PER_STEP } from '../utils/const.js';
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
import { updateItemById } from '../utils/utils.js';

export default class BoardPresenter {
  #movies = new MoviesView();
  #moviesList = new MoviesListView();
  #moviesContainer = new MoviesContainerView();
  #showMoreButton = new ShowMoreButton();
  #boardContainer;
  #moviesModel;
  #boardMovies;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
  #filters;
  #moviesPresenter = new Map();
  #popupPresenter;
  #popupMovieId = null;
  #filtersNavigation = null;

  constructor(container, moviesModel) {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
  }

  init = () => {
    this.#boardMovies = [...this.#moviesModel.movies];
    this.#renderBoard();
  };

  #renderBoard = () => {
    this.#renderFilters();
    this.#renderSorting();
    this.#renderMoviesList();
  };

  #renderFilters = () => {
    this.#filters = generateFilter(this.#boardMovies);
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
    render(new SortView, this.#boardContainer);
  };

  #renderMoviesList = () => {
    this.#renderMoviesContainer();
    this.#renderMoviesListMessage();
    this.#renderMovies(this.#boardMovies);
  };

  #renderMoviesContainer = () => {
    render(this.#movies,this.#boardContainer);
    render(this.#moviesList,this.#movies.element);
  };

  #renderMoviesListMessage = () => {
    render(new MoviesListMesssageView(this.#boardMovies.length), this.#moviesList.element);
  };

  #renderMovies = (movies) => {
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(movies.length,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
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
    if (this.#boardMovies.length > MOVIES_NUMBER_PER_STEP) {
      render(this.#showMoreButton,this.#moviesList.element);
      this.#showMoreButton.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_NUMBER_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMoviesCount += MOVIES_NUMBER_PER_STEP;

    if (this.#renderedMoviesCount >= this.#boardMovies.length) {
      this.#showMoreButton.element.remove();
      this.#showMoreButton.removeElement();
    }
  };

  #clearMoviesList = () => {
    this.#moviesPresenter.forEach((presenter) => presenter.destroy());
    this.#moviesPresenter.clear();
    this.#renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
    remove(this.this.#showMoreButton);
  };

  #showMovieDetails = (movie,comments) => {
    this.#popupMovieId = movie.id;
    this.#popupPresenter = new PopupPresenter(movie, comments, this.#handleMovieControlChange);
    this.#popupPresenter.init();
  };

  #handleMovieControlChange = (movie,controls) => {
    this.#moviesPresenter.get(movie.id).updateControls(controls);
    if (this.#popupMovieId === movie.id) {
      this.#popupPresenter.updateControls(controls);
    }
    this.#boardMovies = updateItemById(this.#boardMovies, movie);
    this.#renderFilters();
  };

}