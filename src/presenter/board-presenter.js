
import { render,remove, replace } from '../framework/render.js';
import { FilterMessage, FilterType, MoviesUpdateGroup, MOVIES_NUMBER_PER_STEP, SortType, UpdateType, UserAction, TimeLimit} from '../utils/const.js';
import FilterModel from '../model/filters-model.js';
import FilterNavigationView from '../view/filter-navigation-view.js';
import SortView from '../view/sort-view.js';
import MoviesContainerView from '../view/movies/movies-container-view.js';
import MoviesListView from '../view/movies/movies-list-view.js';
import MoviesListMesssageView from '../view/movies/movies-list-message-view.js';
import MoviesView from '../view/movies/movies-view.js';
import ShowMoreButtonView from '../view/show-more-button-view.js';
import MoviePresenter from './movie-presenter.js';
import PopupPresenter from './popup-presenter.js';
import { sortByDateUp, sortByDateDown, sortByRatingUp, sortByRatingDown, setAborting } from '../utils/utils.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #boardContainer;
  #moviesModel;
  #filtersModel;
  #uiBlocker = new UiBlocker(TimeLimit.LOWER_LIMIT, TimeLimit.UPPER_LIMIT);
  #moviesComponent = new MoviesView();
  #moviesListComponent = new MoviesListView();
  #moviesContainerComponent = new MoviesContainerView();
  #showMoreButtonComponent = new ShowMoreButtonView();
  #loadingComponent = new LoadingView();
  #listMesssageComponent = null;
  #filtersNavigationComponent = null;
  #sortComponent = null;
  #boardMovies = [];
  #moviesLength;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
  #filters;
  #moviesPresenter = new Map();
  #popupPresenter;
  #popupMovieId = null;
  #currentFilter = null;
  #currentSortType = null;
  #newSortType = null;
  #currentSortDirection = true;
  #isLoading = true;

  constructor(container, moviesModel, filtersModel) {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
    this.#filtersModel = filtersModel;
  }

  init = () => {
    this.#moviesModel.addObserver(this.#handleUpdateMoviesList, MoviesUpdateGroup.ALL);
    this.#filtersModel = new FilterModel(this.#moviesModel);
    this.#filtersModel.addObserver(this.#handleFilterModelUpdate);
    this.#renderBoard();
  };

  #renderBoard = () => {
    this.#renderFilters();
    this.#renderSorting();
    this.#updateMoviesList();
  };

  #renderFilters = () => {
    this.#filtersModel.init(this.#moviesModel.movies);
    this.#filters = this.#filtersModel.filters;

    const prevFiltersNavigation = this.#filtersNavigationComponent;
    this.#filtersNavigationComponent = new FilterNavigationView(this.#filters);
    this.#filtersNavigationComponent.setClickHandler(this.#handleFilterClick);

    if ( prevFiltersNavigation === null || this.#filtersNavigationComponent === null ) {
      render(this.#filtersNavigationComponent, this.#boardContainer);
      return;
    }

    if (this.#boardContainer.contains(prevFiltersNavigation.element)) {
      replace(this.#filtersNavigationComponent, prevFiltersNavigation);
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
    if (!this.#newSortType) {
      this.#newSortType = SortType.DEFAULT;
    }
    const prevSortComponent = this.#sortComponent;
    this.#sortComponent = new SortView( this.#newSortType, this.#boardMovies.length > 0 );
    this.#sortComponent.setClickHandler(this.#handleSortingChange);

    if ( prevSortComponent === null || this.#sortComponent === null ) {
      render(this.#sortComponent, this.#boardContainer);
      return;
    }
    if (this.#boardContainer.contains(prevSortComponent.element)) {
      replace(this.#sortComponent, prevSortComponent);
    }
    remove(prevSortComponent);
  };

  #handleSortingChange = (sortType) => {
    if (this.#newSortType !== sortType ) {
      this.#newSortType = sortType;
      this.#renderSorting();
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
        return [...this.#moviesModel.movies].sort(this.#currentSortDirection ? sortByDateUp : sortByDateDown);
      case SortType.RATING:
        return [...this.#moviesModel.movies].sort(this.#currentSortDirection ? sortByRatingDown : sortByRatingUp);
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
    this.#renderSorting();
  };

  #renderMoviesContainer = () => {
    render(this.#moviesComponent ,this.#boardContainer);
    render(this.#moviesListComponent,this.#moviesComponent.element);
    this.#moviesModel.addObserver(this.#handleMovieControlModelEvent, MoviesUpdateGroup.SINGLE);
  };

  #renderMoviesListMessage = () => {
    const prevListMesssage = this.#listMesssageComponent;
    this.#moviesLength = this.#boardMovies.length;
    this.#listMesssageComponent = new MoviesListMesssageView(this.#moviesLength, FilterMessage[this.#currentFilter]);
    //отрисовка кнопки загрузки фильмов
    this.#renderLoading();

    if ( prevListMesssage === null || this.#listMesssageComponent === null ) {
      render(this.#listMesssageComponent, this.#moviesListComponent.element);
      return;
    }

    if (this.#moviesListComponent.element.contains(prevListMesssage.element)) {
      replace(this.#listMesssageComponent, prevListMesssage);
    }
    remove(prevListMesssage);

  };

  #renderMovies = (movies) => {
    render(this.#moviesContainerComponent,this.#moviesListComponent.element);

    Array.from({length: Math.min(this.#moviesLength,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(movies[index]);
    });

    this.#renderShowMoreButton();
  };

  #renderMovie = (movie) => {
    const moviePresenter = new MoviePresenter(movie, this.#moviesContainerComponent.element, this.#showMovieDetails, this.#handleMovieControlViewEvent);
    moviePresenter.init();
    this.#moviesPresenter.set(movie.id, moviePresenter);
  };

  #handleUpdateMoviesList = (updateType, userAction, movies) => {
    this.#uiBlocker.block();
    if (userAction === UserAction.UPDATE) {
      switch (updateType) {
        case UpdateType.INIT:
          this.#isLoading = false;
          remove(this.#loadingComponent);
          this.#boardMovies = movies;
          this.#renderBoard();
          break;
        default:
          break;
      }
    }
    this.#uiBlocker.unblock();
  };

  #renderShowMoreButton = () => {
    if (this.#moviesLength > MOVIES_NUMBER_PER_STEP) {
      render(this.#showMoreButtonComponent,this.#moviesListComponent.element);
      this.#showMoreButtonComponent.setClickHandler(this.#handleShowMoreButtonClick);
    }
  };

  #renderLoading = () => {
    if (this.#isLoading) {
      render(this.#loadingComponent, this.#moviesListComponent.element);
    }
  };

  #handleShowMoreButtonClick = () => {
    this.#boardMovies
      .slice(this.#renderedMoviesCount, this.#renderedMoviesCount + MOVIES_NUMBER_PER_STEP)
      .forEach((movie) => this.#renderMovie(movie));

    this.#renderedMoviesCount += MOVIES_NUMBER_PER_STEP;

    if (this.#renderedMoviesCount >= this.#moviesLength) {
      this.#showMoreButtonComponent.element.remove();
      this.#showMoreButtonComponent.removeElement();
    }
  };

  #showMovieDetails = (movie) => {
    this.#popupMovieId = movie.id;
    if (this.#popupPresenter) {
      this.#popupPresenter.closeDetailsView();
    }
    this.#popupPresenter = new PopupPresenter(movie, this.#handleMovieControlViewEvent, this.#handleCommentsModelEvent,this.#uiBlocker);
    this.#popupPresenter.init();
  };

  // обработчик событий изменения модели элементов управления в представлениях
  #handleMovieControlModelEvent = (updateType, id, movie) => {
    this.#uiBlocker.block();
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
    this.#uiBlocker.unblock();
  };

  // обработчик событий изменения модели элементов управления одного фильма
  #handleMovieControlViewEvent = async (actionType, updateType, movie, component) => {
    this.#uiBlocker.block();
    switch (actionType) {
      case UserAction.UPDATE:
        try {
          await this.#moviesModel.updateSingleMovie(updateType,movie);
        } catch (error) {
          setAborting(component);
        }
        break;
      default:
        break;
    }
    this.#uiBlocker.unblock();
  };

  // обработчик событий изменения модели комментариев
  #handleCommentsModelEvent = (updateType, movieId, comments) => {
    // Обновление модели комментариев
    this.#uiBlocker.block();
    switch (updateType) {
      case UpdateType.INIT:
        this.#popupPresenter.updateBottomContainer();
        break;
      case UpdateType.PATCH:
        this.#moviesPresenter.get(movieId).updateData(comments);
        this.#popupPresenter.updateBottomContainer();
        break;
      default:
        break;
    }
    this.#uiBlocker.unblock();
  };

  #clearMoviesList = () => {
    this.#moviesPresenter.forEach((presenter) => presenter.destroy());
    this.#moviesPresenter.clear();
    this.#renderedMoviesCount = MOVIES_NUMBER_PER_STEP;
    remove(this.#showMoreButtonComponent);
  };

}
