import { nanoid } from 'nanoid';
import adapter from 'webrtc-adapter';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {
  EMOTIONS
} from '../../utils/const.js';

const isEnterKey = (evt) => evt.key === 'Enter';

const createMovieCommentItemTemplate = (comment) => (
  `<li class="film-details__comment">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
    </span>
    <div>
      <p class="film-details__comment-text">${comment.text}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${comment.author}</span>
        <span class="film-details__comment-day">${comment.date}</span>
        <button class="film-details__comment-delete" data-id="${comment.id}">Delete</button>
      </p>  
    </div>
  </li>`
);

const createMovieCommentsContainerTemplate = (comments) => {
  const commentsText = comments.length === 1 ? 'comment' : 'comments';
  const commentItemsTemplate = comments
    .map((comment) => createMovieCommentItemTemplate(comment))
    .join('');

  return (`
    <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length > 0 ? `${comments.length} ${commentsText}` : 'No comments'}</span></h3>
    <ul class="film-details__comments-list">
      ${commentItemsTemplate}
    </ul>`);
};

const createMovieEmotionTemplate = (emoji) => (`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.name}" value="${emoji.name}">
  <label class="film-details__emoji-label" for="emoji-${emoji.name}" >
    <img src="./images/emoji/${emoji.name}.png" width="30" height="30" alt="emoji" data-name="${emoji.name}">
  </label>`
);

const showCurrentEmotionTemplate = (emojiName) => emojiName ? `<img src="./images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}" data-name="${emojiName}"></img>` : '';

const createMovieNewCommentTemplate = (emotion,comment) => {
  const currentEmotionState = showCurrentEmotionTemplate(emotion);

  const emotionsTemplate = Object.values(EMOTIONS)
    .map((emoji)=> createMovieEmotionTemplate(emoji))
    .join('');

  return (`
    <form class="film-details__new-comment" action="" method="get">
      <div class="film-details__add-emoji-label">
        ${currentEmotionState}
      </div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emotionsTemplate}
      </div>
    </form>`);
};

const createMovieDetailsBottomContainerTemplate = (state) => (
  `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
       ${createMovieCommentsContainerTemplate(state.comments)}
       ${createMovieNewCommentTemplate(state.emotion, state.comment)}
    </section>
  </div>`
);

export default class MovieDetailsBottomContainerView extends AbstractStatefulView {
  #comments;

  constructor(movieid, comments) {
    super();
    this._state = MovieDetailsBottomContainerView.parseCommentsToState(movieid, comments);
  }

  static parseCommentsToState = (movieId,comments) => ({
    comments: [...comments],
    movieId: movieId,
    author: adapter.browserDetails.browser,
    emotion: '',
    comment: '',
  });

  static parseStateToComments = (state) => state.comments;

  setHandlers = (callback) => {
    this._callback.updateComments = callback;
    this.#setEmotionClickHandler();
    this.#setOnValueInput();
    this.#setDeleteHandler();
    this.#setAddCommentListener();
  };

  #setEmotionClickHandler = () => {
    this.element.querySelectorAll('.film-details__emoji-label').forEach((emotion) => emotion.addEventListener('click', this.#emotionClickHandler));
  };

  #emotionClickHandler = (evt) => {
    evt.preventDefault();
    this._state.emotion = evt.target.dataset.name;
    this.updateElement({
      emotion: this._state.emotion,
    });
  };

  #setOnValueInput = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('input', this.#commentInputHandler);
  };

  #commentInputHandler = () => {
    this._state.comment = this.element.querySelector('.film-details__comment-input').value;
  };

  #setDeleteHandler = () => {
    this.element.querySelectorAll('.film-details__comment-delete').forEach((button) => button.addEventListener('click', this.#deleteCommentHandler));
  };

  #deleteCommentHandler = (evt) => {
    evt.preventDefault();
    this._state.comments.splice(this._state.comments.findIndex((comment) => comment.id === evt.target.dataset.id));
    this._callback.updateComments(this._state.movieId,MovieDetailsBottomContainerView.parseStateToComments(this._state));
    this.updateElement(this._state);
  };

  #setAddCommentListener = () => {
    this.element.querySelector('.film-details__comment-input').addEventListener('keydown', (evt) => {
      if (isEnterKey(evt)) {
        evt.preventDefault();
        this.#submitNewComment();
      }
    });
  };

  #submitNewComment = () => {
    if (this._state.comment && this._state.emotion) {
      const id = nanoid();
      const newComment = {
        id: id,
        movieId: this._state.movieId,
        author: this._state.author,
        text: this._state.comment,
        date: new Date(),
        emoji: this._state.emotion,
      };
      this._state.comments.push(newComment);
      this._state.comment = '';
      this._state.emotion = '';
      this._callback.updateComments(this._state.movieId,MovieDetailsBottomContainerView.parseStateToComments(this._state));
      this.updateElement(this._state);
    }
  };

  _restoreHandlers = () => {
    this.setHandlers(this._callback.updateComments);
  };

  get template() {
    return createMovieDetailsBottomContainerTemplate(this._state);
  }
}
