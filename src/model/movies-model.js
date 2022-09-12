import { MOVIES_NUMBER_DEFAULT } from '../mock/const.js';
import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  movies = Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => generateMovie(index));
  getMovies = () => this.movies;
}
