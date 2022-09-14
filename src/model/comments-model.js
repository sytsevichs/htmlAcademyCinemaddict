import { COMMENTS_NUMBER_DEFAULT } from '../mock/const.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../mock/utils.js';

export default class CommentsModel {
  #movieId;

  constructor(movieId) {
    this.#movieId = movieId;
  }

  generateComments = () => Array.from({length: getRandomInteger(0,COMMENTS_NUMBER_DEFAULT)}, (a,index) => generateComment(index, this.#movieId));

  get comments() {
    return this.generateComments();
  }
}
