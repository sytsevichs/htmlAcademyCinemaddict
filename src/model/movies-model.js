import { MOVIES_NUMBER_DEFAULT } from '../utils/const.js';
import { generateMovie } from '../mock/movie.js';

export default class MoviesModel {
  get movies() {
    return Array.from({length: MOVIES_NUMBER_DEFAULT}, (a ,index) => generateMovie(index));
  }
}
