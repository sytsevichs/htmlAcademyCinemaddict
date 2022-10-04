import adapter from 'webrtc-adapter';
import AbstractStatefulView from '../../framework/view/abstract-stateful-view.js';
import {
  EMOTIONS, UpdateType, UserAction
} from '../../utils/const.js';

const isEnterKey = (evt) => evt.key === 'Enter';

const createMovieEmotionTemplate = (emoji) => (`<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.name}" value="${emoji.name}">
  <label class="film-details__emoji-label" for="emoji-${emoji.name}" >
    <img src="./images/emoji/${emoji.name}.png" width="30" height="30" alt="emoji" data-name="${emoji.name}">
  </label>`
);

const showCurrentEmotionTemplate = (emojiName) => emojiName ? `<img src="./images/emoji/${emojiName}.png" width="55" height="55" alt="emoji-${emojiName}" data-name="${emojiName}"></img>` : '';

const createMovieNewCommentTemplate = (emotion,comment, isDisabled) => {
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
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"${isDisabled ? 'disabled>' : '>'}${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emotionsTemplate}
      </div>
    </form>`);
};


export default class MovieDetailsNewCommentView extends AbstractStatefulView {
  constructor() {
    super();
    this._state = MovieDetailsNewCommentView.parseCommentsToState();
  }

  static parseCommentsToState = () => ({
    author: adapter.browserDetails.browser,
    emotion: '',
    comment: '',
    isSaving: false,
  });

  setHandlers = (callback) => {
    this._callback.updateMovieComments = callback;
    this.#setEmotionClickHandler();
    this.#setOnValueInput();
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


  #setAddCommentListener = () => {
    this.element.addEventListener('keydown', (evt) => {
      if (!this._state.isSaving && isEnterKey(evt) && evt.ctrlKey) {
        evt.preventDefault();
        this.#submitNewComment();
      }
    });
  };

  //Обработка добавления нового комментария из состояния представления
  #submitNewComment = () => {
    if (this._state.comment && this._state.emotion) {
      const newComment = {
        author: this._state.author,
        comment: this._state.comment,
        emotion: this._state.emotion,
        date: new Date(),
      };
      //Передаем новый комментарий в модель

      this._state.isSaving = true;
      this.updateElement(this._state);
      this._callback.updateMovieComments(UserAction.ADD, UpdateType.PATCH, newComment);
    }
  };

  _restoreHandlers = () => {
    this.setHandlers(this._callback.updateMovieComments);
  };

  get template() {
    return createMovieNewCommentTemplate(this._state.emotion, this._state.comment, this._state.isSaving);
  }
}
