import { UpdateType } from '../utils/const.js';
import Observer from '../framework/observable.js';
export default class CommentsModel extends Observer {

  #movieId;
  #comments = null;
  #commentsService;

  constructor(movieId, commentsService) {
    super();
    this.#movieId = movieId;
    this.#commentsService = commentsService;
  }

  get comments() {
    if (!this.#comments) {
      this.#comments = [];
    }
    return this.#comments;
  }

  set comments(comments) {
    this.#comments = comments;
  }

  init = async () => {
    try {
      this.#comments = await this.#commentsService.comments;
    } catch (error) {
      this.#comments = [];
    }
    this._notify(UpdateType.INIT, this.#movieId, this.#comments);
  };


  addComment = (updateType, update) => {
    this.#comments = [
      update,
      ...this.#comments,
    ];

    this._notify(updateType, this.#movieId, this.#comments);
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

    this._notify(updateType, this.#movieId, this.#comments);
  };
}
