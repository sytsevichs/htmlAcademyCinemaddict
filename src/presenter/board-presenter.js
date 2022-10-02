
import { render,remove, replace } from '../framework/render.js';
import { FilterMessage, FilterType, MoviesUpdateGroup, MOVIES_NUMBER_PER_STEP, SortType, UpdateType, UserAction } from '../utils/const.js';
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
import FilterModel from '../model/filters-model.js';

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
  #filtersModel;
  #moviesPresenter = new Map();
  #popupPresenter;
  #popupMovieId = null;
  #filtersNavigation = null;
  #listMesssage = null;
  #currentFilter = null;
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
    this.#filtersModel = new FilterModel(this.#moviesModel.movies);
    this.#filtersModel.addObserver(this.#handleFilterModelUpdate);
    this.#filters = this.#filtersModel.filters;
    this.#renderFilters();
    this.#renderSorting();
    this.#renderMoviesList();
  };

  #renderFilters = () => {
    const prevFiltersNavigation = this.#filtersNavigation;
    this.#filtersNavigation = new FilterNavigationView(this.#filters);
    this.#filtersNavigation.setClickHandler(this.#handleFilterClick);

    if ( prevFiltersNavigation === null || this.#filtersNavigation === null ) {
      render(this.#filtersNavigation, this.#boardContainer);
      return;
    }

    if (this.#boardContainer.contains(prevFiltersNavigation.element)) {
      replace(this.#filtersNavigation, prevFiltersNavigation);
    }
    remove(prevFiltersNavigation);
  };

  #handleFilterModelUpdate = (updateType, newFilter, newFilters) => {
    this.#currentFilter = newFilter;
    this.#filters = newFilters;
    this.#renderFilters();
    this.#updateMoviesList();
  };

  #handleFilterClick = (newFilter) => {
    this.#filtersModel.updateSingleFilter(newFilter);
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
    this.#updateMoviesList();
  };

  #updateMoviesList = () => {
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
    if (!this.#currentFilter || this.#currentFilter === FilterType.all ) {
      this.#currentFilter = FilterType.all;
      this.#boardMovies = this.movies;
    } else {
      this.#boardMovies = this.movies
        .filter((movie) => this.#filters
          .filter((filter) => filter.active).every((filter) => movie.controls.filter((control) => control.active).some((control) =>control.name === filter.name) ));
    }
    this.#renderMoviesListMessage();
    this.#renderMovies(this.#boardMovies);
  };

  #renderMoviesContainer = () => {
    render(this.#movies,this.#boardContainer);
    render(this.#moviesList,this.#movies.element);
    this.#moviesModel.addObserver(this.#handleMovieControlModelEvent, MoviesUpdateGroup.SINGLE);
  };

  #renderMoviesListMessage = () => {
    const prevListMesssage = this.#listMesssage;
    this.#moviesLength = this.#boardMovies.length;
    this.#listMesssage = new MoviesListMesssageView(this.#moviesLength, FilterMessage[this.#currentFilter]);

    if ( prevListMesssage === null || this.#listMesssage === null ) {
      render(this.#listMesssage, this.#moviesList.element);
      return;
    }

    if (this.#moviesList.element.contains(prevListMesssage.element)) {
      replace(this.#listMesssage, prevListMesssage);
    }
    remove(prevListMesssage);

  };

  #renderMovies = (movies) => {
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(this.#moviesLength,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(movies[index]);
    });

    this.#renderShowMoreButton();
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(movie, this.#moviesContainer.element, this.#showMovieDetails, this.#handleMovieControlViewEvent,this.#handleCommentsModelEvent);
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
    this.#popupPresenter = new PopupPresenter(movie, comments, this.#handleMovieControlViewEvent, this.#handleCommentsViewEvent);
    this.#popupPresenter.init();
  };

  // обработчик событий изменения модели элементов управления в представлениях
  #handleMovieControlModelEvent = (updateType, id, movie) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviesPresenter.get(id).updateControls();
        if (this.#popupMovieId === id) {
          this.#popupPresenter.updateControls(movie.controls);
        }
        this.#renderFilters();
        break;

      default:
        break;
    }
  };

  // обработчик событий изменения модели элементов управления одного фильма
  #handleMovieControlViewEvent = (actionType, updateType, movie) => {
    switch (actionType) {
      case UserAction.UPDATE:
        this.#moviesModel.updateSingleMovie(updateType,movie);
        break;
      default:
        break;
    }

  };

  // обработчик событий изменения модели комментариев
  #handleCommentsViewEvent = (actionType, updateType, movieId, comment) => {
    // Обновление модели комментариев
    this.#moviesPresenter.get(movieId).updateCommentsModel(actionType, updateType, comment);
  };

  // обработчик событий изменения модели комментариев
  #handleCommentsModelEvent = (updateType, movieId, comments) => {
    // Обновление модели комментариев
    switch (updateType) {
      case UpdateType.PATCH:
        this.#moviesPresenter.get(movieId).updateData(comments);
        break;

      default:
        break;
    }
  };

  #clearMoviesList = () => {
    this.#moviesPresenter.forEach((presenter) => presenter.destroy());
    this.#moviesPresenter.clear();
    this.#renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
    remove(this.#showMoreButton);
  };

}
