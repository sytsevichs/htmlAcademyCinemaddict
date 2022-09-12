import MovieCardView from '../view/movie-card-view.js';
import MovieDetailView from '../view/movie-details-view.js';
import MoviesContainerView from '../view/movies-container-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesView from '../view/movies-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import { render } from '../render.js';
import CommentsModel from '../model/comments-model.js';
import { isEscapeKey } from '../mock/utils.js';
import { MOVIES_NUMBER_DEFAULT } from '../mock/const.js';

const closeDetailsView = () => {
  const detailsElement = document.querySelector('.film-details');
  if (detailsElement) {
    detailsElement.remove();
  }
};

const showMovieDetails = (movie,comments) => {
  closeDetailsView();
  const movieDetails = new MovieDetailView(movie,comments);
  const detailsElement = movieDetails.getElement();
  const closeButtonElement = detailsElement.querySelector('.film-details__close');
  closeButtonElement.addEventListener('click',closeDetailsView);
  document.body.append(detailsElement);

  //Убрать детали по Escape
  document.addEventListener('keydown', (evt) => {
    if (isEscapeKey(evt)) {
      evt.preventDefault();
      detailsElement.remove();
    }
  });

};

export default class Presenter {
  movies = new MoviesView();
  moviesList = new MoviesListView();
  moviesContainer = new MoviesContainerView();
  showMoreButton = new ShowMoreButton();

  init = (container, moviesModel) => {
    this.boardContainer = container;
    this.moviesModel = moviesModel;
    this.boardMovies = [...this.moviesModel.getMovies()];

    render(this.movies,container);
    render(this.moviesList,this.movies.getElement());
    render(this.moviesContainer,this.moviesList.getElement());

    Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => {
      const movieCommentsModel = new CommentsModel(index);
      render(new MovieCardView(this.boardMovies[index],[...movieCommentsModel.getComments()],showMovieDetails),this.moviesContainer.getElement());
    });

  };
}
