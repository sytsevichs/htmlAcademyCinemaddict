import MovieCardView from '../view/movie-card-view.js';
import MoviesContainerView from '../view/movies-container-view.js';
import MoviesListView from '../view/movies-list-view.js';
import MoviesView from '../view/movies-view.js';
import ShowMoreButton from '../view/show-more-button-view.js';
import {render} from '../render.js';

export default class Presenter {
  movies = new MoviesView();
  moviesList = new MoviesListView();
  moviesContainer = new MoviesContainerView();
  showMoreButton = new ShowMoreButton();

  init = (container) => {
    render(this.movies,container);
    render(this.moviesList,this.movies.getElement());
    render(this.moviesContainer,this.moviesList.getElement());
    for (let i = 0; i < 5; i++)
    {
      render(new MovieCardView(),this.moviesContainer.getElement());
    }
  };
}
