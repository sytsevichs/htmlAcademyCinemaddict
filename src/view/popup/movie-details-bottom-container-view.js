import AbstactView from '../../framework/view/abstract-view.js';
import { EMOTIONS } from '../../utils/const.js';

const createMovieDetailsBottomContainerTemplate = (comments) => {
  const commentsText = comments.length === 1 ? 'comment' : 'comments';

  return (`<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length > 0 ? `${comments.length} ${commentsText}` : 'No comments'}</span></h3>

      <ul class="film-details__comments-list">
        ${Object.values(comments).map((comment) => `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="./images/emoji/${comment.emoji}.png" width="55" height="55" alt="emoji-${comment.emoji}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment.text}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${comment.author}</span>
              <span class="film-details__comment-day">${comment.date}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`)}
      </ul>

      <form class="film-details__new-comment" action="" method="get">
        <div class="film-details__add-emoji-label"></div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
        </label>

        <div class="film-details__emoji-list">
          ${Object.values(EMOTIONS).map((emoji)=> `<input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-${emoji.name}" value="${emoji.name}">
          <label class="film-details__emoji-label" for="emoji-${emoji.name}">
            <img src="./images/emoji/${emoji.name}.png" width="30" height="30" alt="emoji">
          </label>`)}
        </div>
      </form>
    </section>
  </div>`);
};


export default class MovieDetailsBottomContainerView extends AbstactView {
  #comments;

  constructor(comments) {
    super();
    this.#comments = comments;
  }

  get template() {
    return createMovieDetailsBottomContainerTemplate(this.#comments);
  }
}
