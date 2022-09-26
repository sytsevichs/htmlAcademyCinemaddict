import { COMMENTS_NUMBER_DEFAULT } from '../utils/const.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils/utils.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #movieId;
  #comments = [];

  constructor(movieId) {
    super();
    this.#movieId = movieId;
  }

  #generateComments = () => Array.from({length: getRandomInteger(0,COMMENTS_NUMBER_DEFAULT)}, () => generateComment(this.#movieId));

  get comments() {
    this.#comments = this.#generateComments();
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }
}
