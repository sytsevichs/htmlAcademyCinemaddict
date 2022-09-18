import MovieCardView from '../view/movie-card-view.js';
import MovieDetailView from '../view/movie-details-view.js';
import MoviesContainerView from '../view/movies-container-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesView from '../view/movies-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import { render } from '../render.js';
import CommentsModel from '../model/comments-model.js';
import { isEscapeKey } from '../mock/utils.js';
import { MOVIES_NUMBER_PER_STEP } from '../mock/const.js';
import MoviesListMesssageView from '../view/movies-list-message-view.js';

const closeDetailsView = () => {
  const bodyElement = document.querySelector('body');
  const detailsElement = bodyElement.querySelector('.film-details');
  if (detailsElement) {
    detailsElement.remove();
    bodyElement.classList.remove('hide-overflow');
  }
};

const showMovieDetails = (movie,comments) => {
  closeDetailsView();
  const bodyElement = document.querySelector('body');
  const movieDetails = new MovieDetailView(movie,comments);
  const detailsElement = movieDetails.element;
  const closeButtonElement = detailsElement.querySelector('.film-details__close');
  closeButtonElement.addEventListener('click',closeDetailsView);
  bodyElement.appendChild(detailsElement);
  bodyElement.classList.add('hide-overflow');
  //Убрать детали по Escape
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      detailsElement.remove();
      bodyElement.classList.remove('hide-overflow');
    }
  });
};

export default class Presenter {
  #movies = new MoviesView();
  #moviesList = new MoviesListView();
  #moviesContainer = new MoviesContainerView();
  #showMoreButton = new ShowMoreButton();
  #boardContainer;
  #moviesModel;
  #boardMovies;
  #renderedMoviesCount = MOVIES_NUMBER_PER_STEP;

  init = (container, moviesModel) => {
    this.#boardContainer = container;
    this.#moviesModel = moviesModel;
    this.#boardMovies = [...this.#moviesModel.movies];

    render(this.#movies,this.#boardContainer);
    render(this.#moviesList,this.#movies.element);
    render(new MoviesListMesssageView(this.#boardMovies.length), this.#moviesList.element);
    render(this.#moviesContainer,this.#moviesList.element);

    Array.from({length: Math.min(this.#boardMovies.length,MOVIES_NUMBER_PER_STEP)}, (a ,index) => {
      this.#renderMovie(this.#boardMovies[index]);
    });

    if (this.#boardMovies.length > MOVIES_NUMBER_PER_STEP) {
      render(this.#showMoreButton,this.#moviesList.element);
      this.#showMoreButton.element.addEventListener('click',this.#handleShowMoreButtonClick);
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
    const movieCardView = new MovieCardView(movieComponent,[...movieCommentsModel.comments],showMovieDetails);

    render(movieCardView,this.#moviesContainer.element);
  };
}
