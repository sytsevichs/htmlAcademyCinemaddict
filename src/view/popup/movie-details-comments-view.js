import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {UpdateType, UserAction
} from '../../utils/const.js';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
TimeAgo.addDefaultLocale(en);

const commentDate = (date) => new Date(date);

const createMovieCommentItemTemplate = (comment, isDisabled, timeAgo) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.comment}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${timeAgo.format(Date.now() - commentDate(comment.date))}</span>
        <button class="film-details__comment-delete" data-id="${comment.id}"${isDisabled ? 'disabled>Deleting...' : '>Delete'}</button>
      </p>  
    </div>
  </li>`
);

const createMovieCommentsContainerTemplate = (comments, deletingCommentId, timeAgo) => {
  const commentsText = comments.length === 1 ? 'comment' : 'comments';
  const commentItemsTemplate = comments
    .map((comment) => createMovieCommentItemTemplate(comment, comment.id === deletingCommentId, timeAgo))
    .join('');

  return (`
    <div>
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length > 0 ? `${comments.length} ${commentsText}` : 'No comments'}</span></h3>
      <ul class="film-details__comments-list">
        ${commentItemsTemplate}
      </ul>
    </div>`);
};

export default class MovieDetailsCommentsView extends AbstractStatefulView {
  #timeAgo;

  constructor(movieid, comments) {
    super();
    this._state = MovieDetailsCommentsView.parseCommentsToState(movieid, comments);

    this.#timeAgo = new TimeAgo('en-US');
  }

  static parseCommentsToState = (movieId,comments) => ({
    comments: [...comments],
    movieId: movieId,
    isDeleting: null,
  });

  static parseStateToComments = (state) => state.comments;

  setHandlers = (callback) => {
    this._callback.updateMovieComments = callback;
    this.#setDeleteHandler();
  };

  #setDeleteHandler = () => {
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentHandler));
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    //Обновляем состояние и модель
    if (!this._state.isDeleting) {
      this._state.isDeleting = evt.target.dataset.id;
      this.updateElement(this._state);
      this._callback.updateMovieComments(UserAction.DELETE, UpdateType.PATCH, this._state.comments[this._state.comments.findIndex((comment) => comment.id === evt.target.dataset.id)]);

      const index = this._state.comments.findIndex((comment) => comment.id === evt.target.dataset.id);

      if (index !== -1) {
        this._state.comments = [
          ...this._state.comments.slice(0, index),
          ...this._state.comments.slice(index + 1),
        ];
      }

      this._state.isDeleting = null;
      this.updateElement(this._state);
    }
  };

  _restoreHandlers = () => {
    this.setHandlers(this._callback.updateMovieComments);
  };

  get template() {
    return createMovieCommentsContainerTemplate(this._state.comments, this._state.isDeleting, this.#timeAgo);
  }
}
