import { remove, render, replace } from '../framework/render.js';
import MovieCardView from '../view/movies/movie-card-view.js';
import CommentsModel from '../model/comments-model.js';
import MovieCardContainerView from '../view/movies/movie-card-container-view.js';
import MovieCardControlsView from '../view/movies/movie-card-controls-view.js';
import { updateItemByName } from '../utils/utils.js';
export default class MoviePresenter {
  #movie;
  #container;
  #showMovieDetails;
  #updateMovieControls;
  #movieCardContainer = new MovieCardContainerView();
  #movieCommentsModel;
  #movieComments;
  #movieCardView = null;
  #movieCardControlsView = null;

  constructor(movie, container,showMovieDetails,updateMovieControls) {
    this.#movie = movie;
    this.#container = container;
    this.#showMovieDetails = showMovieDetails;
    this.#updateMovieControls = updateMovieControls;
  }

  init = () => {

    this.#generateComments(this.#movie.id);

    this.#renderData(this.#movieCardContainer.element);
    this.#renderControls(this.#movieCardContainer.element);
    render(this.#movieCardContainer,this.#container);
  };

  destroy = () => {
    remove(this.#movieCardView);
    remove(this.#movieCardControlsView);
    remove(this.#movieCardContainer);
  };

  updateControls = () => {
    this.#renderControls(this.#movieCardContainer.element);
  };

  #generateComments = (id) => {
    this.#movieCommentsModel = new CommentsModel(id);
    this.#movieComments = [... this.#movieCommentsModel.comments];
  };

  #renderData = (container) => {
    const prevMovieCardView = this.#movieCardView;
    this.#movieCardView = new MovieCardView(this.#movie, this.#movieComments );

    if ( prevMovieCardView === null || this.#movieCardView === null ) {
      this.#movieCardView.setClickHandler(this.#showMovieDetails);
      render(this.#movieCardView,container);
      return;
    }

    if (container.contains(prevMovieCardView.element)) {
      replace(this.#movieCardView, prevMovieCardView);
    }

    remove(prevMovieCardView);
  };

  #renderControls = (container) => {
    const prevMovieCardControlsView = this.#movieCardControlsView;
    this.#movieCardControlsView = new MovieCardControlsView(this.#movie.controls);
    this.#movieCardControlsView.setClickHandler(this.#changeMovieControl);

    if ( prevMovieCardControlsView === null || this.#movieCardControlsView === null ) {
      render(this.#movieCardControlsView,container);
      return;
    }

    if (container.contains(prevMovieCardControlsView.element)) {
      replace(this.#movieCardControlsView, prevMovieCardControlsView);
    }

    remove(prevMovieCardControlsView);
  };

  #changeMovieControl = (control) => {
    control.active = !control.active;
    this.#movie.controls = updateItemByName(this.#movie.controls, control);
    this.#updateMovieControls(this.#movie, this.#movie.controls);
  };

}
