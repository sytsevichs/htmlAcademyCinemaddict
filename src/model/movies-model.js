import { MOVIES_NUMBER_DEFAULT } from '../utils/const.js';
import { generateMovie } from '../mock/movie.js';
import Observable from '../framework/observable.js';
import { updateItemById } from '../utils/utils.js';

export default class MoviesModel extends Observable {
  #movies = null;

  get movies() {
    if (!this.#movies) {
      this.#movies = Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => generateMovie(index));
    }
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
  }

  updateSingleMovie = (movie) => {
    this.#movies = updateItemById(this.#movies, movie);
  };

}
