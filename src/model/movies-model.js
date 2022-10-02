import { CONTROLS, MoviesUpdateGroup, UpdateType, UserAction } from '../utils/const.js';
import Observer from '../framework/observable.js';
import { updateItemById } from '../utils/utils.js';

export default class MoviesModel extends Observer {
  #movies = null;
  #moviesService = null;

  constructor(moviesService) {
    super();
    this.#moviesService = moviesService;
  }

  get movies() {
    if (!this.#movies) {
      this.#movies = [];
    }
    return this.#movies;
  }

  init = async () => {
    try {
      const movies = await this.#moviesService.movies;
      this.#movies = this.#adaptToClient(movies);
    } catch (error) {
      this.#movies = [];
    }
    this._notify(UpdateType.INIT, UserAction.UPDATE, this.#movies, MoviesUpdateGroup.ALL);
  };

  set movies(movies) {
    this.#movies = movies;
    //Вызываем все обработчики, зарегистированные для обновления всех фильмов
    this._notify(UpdateType.MINOR, UserAction.UPDATE, this.#movies, MoviesUpdateGroup.ALL);
  }

  updateSingleMovie = async (updateType, movie) => {
    const index = this.#movies.findIndex((item) => item.id === movie.id);

    if (index === -1){
      throw new Error('Can\'t update unexisting movie');
    }

    try {
      const response = await this.#moviesService.updateMovie(movie);
      const updateMovie = this.#adaptToClientSingle(response);
      this.#movies = updateItemById(this.#movies, updateMovie);
      this._notify(updateType, movie.id, movie, MoviesUpdateGroup.SINGLE);
    } catch (error) {
      throw new Error(`Can't update movie: ${error}`);
    }
    //Вызываем все обработчики, зарегистированные для обновления одного фильма

  };

  #adaptToClient = (movies) => {
    const adaptedMovies = [];
    movies.forEach((movie) => {
      const adaptedMovie = this.#adaptToClientSingle(movie);
      adaptedMovies.push(adaptedMovie);
    });
    return adaptedMovies;
  };

  #adaptToClientSingle = (movie) => {
    const id = movie.id;
    const filmInfo = this.#adaptMovieInfo(movie.film_info);
    const controls = this.#adaptMovieControls(movie.user_details);
    const comments = movie.comments;
    return {id, filmInfo, controls, comments};
  };

  #adaptMovieInfo = (movieInfo) => {
    const adaptedMovieInfo = {...movieInfo,
      alternativeTitle : movieInfo.alternative_title,
      totalRating: movieInfo.total_rating,
      ageRating: movieInfo.age_rating,
      release: {
        date: movieInfo.release.date,
        releaseCountry: movieInfo.release.release_country,
      },
    };
    delete adaptedMovieInfo.alternative_title;
    delete adaptedMovieInfo.total_rating;
    delete adaptedMovieInfo.age_rating;
    return adaptedMovieInfo;
  };

  #adaptMovieControls = (movieControls) => {
    const controls = Object.entries(CONTROLS).map(
      ([index, control]) =>{
        const active = movieControls[`${control.detailsName}`];
        return {
          index,
          name: control.name,
          active: active,
          date: movieControls[`${control.detailsDate}`],
          text: active ? control.textDown : control.textUp,
        };
      });
    return controls;
  };

}
