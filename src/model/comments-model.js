import { COMMENTS_NUMBER_DEFAULT } from '../utils/const.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../utils/utils.js';
import Observable from '../framework/observable.js';

export default class CommentsModel extends Observable {
  #movieId;
  #comments = null;

  constructor(movieId) {
    super();
    this.#movieId = movieId;
  }

  #generateComments = () => Array.from({length: getRandomInteger(0,COMMENTS_NUMBER_DEFAULT)}, () => generateComment(this.#movieId));

  get comments() {
    if (!this.#comments) {
      this.#comments = this.#generateComments();
    }
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  updateComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      update,
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType, update);
  };

  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, update);
  };

  deleteComment = (updateType, update) => {
    const index = this.#comments.findIndex((comment) => comment.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this.#comments = [
      ...this.#comments.slice(0, index),
      ...this.#comments.slice(index + 1),
    ];

    this._notify(updateType);
  };
}
