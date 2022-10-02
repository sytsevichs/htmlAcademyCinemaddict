import { MoviesUpdateGroup, MOVIES_NUMBER_DEFAULT, UpdateType, UserAction } from '../utils/const.js';
import { generateMovie } from '../mock/movie.js';
import Observer from '../framework/observable.js';
import { updateItemById } from '../utils/utils.js';

export default class MoviesModel extends Observer {
  #movies = null;

  get movies() {
    if (!this.#movies) {
      this.#movies = Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => generateMovie(index));
    }
    return this.#movies;
  }

  set movies(movies) {
    this.#movies = movies;
    //Вызываем все обработчики, зарегистированные для обновления всех фильмов
    this._notify(UpdateType.MINOR, UserAction.UPDATE, this.#movies, MoviesUpdateGroup.ALL);
  }

  updateSingleMovie = (updateType, movie) => {
    this.#movies = updateItemById(this.#movies, movie);
    //Вызываем все обработчики, зарегистированные для обновления одного фильма
    this._notify(updateType, movie.id, movie, MoviesUpdateGroup.SINGLE);
  };

}
