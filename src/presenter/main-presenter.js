
import { render } from '../framework/render.js';
import { MOVIES_NUMBER_PER_STEP } from '../utils/const.js';
import { generateFilter } from '../mock/filter.js';
import FilterNavigationView from '../view/filter-navigation-view.js';
import SortView from '../view/sort-view.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import MoviesContainerView from '../view/movies/movies-container-view.js';
import MoviesListView from '../view/movies/movies-list-view.js';
import MoviesListMesssageView from '../view/movies/movies-list-message-view.js';
import MoviesView from '../view/movies/movies-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import CommentsModel from '../model/comments-model.js';
import MoviePresenter from './movie-presenter.js';

export default class MainPresenter {
  #movies = new MoviesView();
  #moviesList = new MoviesListView();
  #moviesContainer = new MoviesContainerView();
  #showMoreButton = new ShowMoreButton();
  #boardContainer;
  #moviesModel;
  #boardMovies;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
  #filters;

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
    render(new FilterNavigationView(this.#filters), this.#boardContainer);
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

  #renderMovies = (movies) => {
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(movies.length,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(movies[index]);
    });

    this.#renderShowMoreButton();
  };

  #renderMovie = (movie) => {
    const movieComponent = movie;
    const movieCommentsModel = new CommentsModel(movieComponent.id);
    const movieComments = [...movieCommentsModel.comments];
    const movieCardView = new MovieCardView(movieComponent,movieComments);
    movieCardView.setClickHandler(this.#showMovieDetails);
    render(movieCardView,this.#moviesContainer.element);
  };

  #showMovieDetails = (movie,comments) => {
    const moviesPresenter = new MoviePresenter(movie,comments);
    moviesPresenter.init();
  };
}
