import { MOVIES_NUMBER_DEFAULT } from '../utils/const.js';
import { generateMovie } from '../mock/movie.js';
import Observable from '../framework/observable.js';

export default class MoviesModel extends Observable {
  #movies;

  get movies() {
    this.#movies = Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => generateMovie(index));
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }
}
