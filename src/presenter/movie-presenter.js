import { remove, render, replace } from '../framework/render.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import MovieCardContainerView from '../view/movies/movie-card-container-view.js';
import MovieCardControlsView from '../view/movies/movie-card-controls-view.js';
import { updateItemByName } from '../utils/utils.js';
import { UpdateType, UserAction } from '../utils/const.js';
export default class MoviePresenter {
  #movie;
  #container;
  #showMovieDetails;
  #handleMovieControlChange;
  #movieCardContainerComponent = new MovieCardContainerView();
  #movieCardComponent = null;
  #movieCardControlsComponent = null;

  constructor(movie, container,showMovieDetails,handleMovieControlChange) {
    this.#movie = movie;
    this.#container = container;
    this.#showMovieDetails = showMovieDetails;
    this.#handleMovieControlChange = handleMovieControlChange;

  }

  init = () => {
    this.#renderData(this.#movieCardContainerComponent.element);
    //Отрисовка управляющих элементов фильма
    this.#renderControls(this.#movieCardContainerComponent.element);
    render(this.#movieCardContainerComponent,this.#container);
  };

  destroy = () => {
    remove(this.#movieCardComponent);
    remove(this.#movieCardControlsComponent);
    remove(this.#movieCardContainerComponent);
  };

  updateControls = () => {
    this.#renderControls(this.#movieCardContainerComponent.element);
  };

  updateData = (comments) => {
    this.#movie.comments = this.#adaptCommentsToMovie(comments);
    //this.#movieCommentsModel.comments = this.#movieComments;
    this.#renderData(this.#movieCardContainerComponent.element);
  };

  #adaptCommentsToMovie = (comments) => {
    const adaptedComments = [];
    comments.forEach((comment) => adaptedComments.push({ id: comment.id }));
    return adaptedComments;
  };

  #renderData = (container) => {
    const prevMovieCardComponent = this.#movieCardComponent;
    this.#movieCardComponent = new MovieCardView(this.#movie, this.#movie.comments );
    this.#movieCardComponent.setClickHandler(this.#showMovieDetails);

    if ( prevMovieCardComponent === null || this.#movieCardComponent === null ) {
      render(this.#movieCardComponent,container);
      return;
    }

    if (container.contains(prevMovieCardComponent.element)) {
      replace(this.#movieCardComponent, prevMovieCardComponent);
    }

    remove(prevMovieCardComponent);
  };

  #renderControls = (container) => {
    const prevMovieCardControlsComponent = this.#movieCardControlsComponent;
    this.#movieCardControlsComponent = new MovieCardControlsView(this.#movie.controls);
    this.#movieCardControlsComponent.setClickHandler(this.#changeMovieControl);

    if ( prevMovieCardControlsComponent === null || this.#movieCardControlsComponent === null ) {
      render(this.#movieCardControlsComponent,container);
      return;
    }

    if (container.contains(prevMovieCardControlsComponent.element)) {
      replace(this.#movieCardControlsComponent, prevMovieCardControlsComponent);
    }

    remove(prevMovieCardControlsComponent);
  };

  #changeMovieControl = (control) => {
    control.active = !control.active;
    this.#movie.controls = updateItemByName(this.#movie.controls, control);
    this.#handleMovieControlChange(UserAction.UPDATE, UpdateType.PATCH, this.#movie, this.#movieCardControlsComponent);
  };

}
