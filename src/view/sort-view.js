import AbstactView from '../framework/view/abstract-view.js';
import { generateSorting } from '../utils/sorting.js';

const createSortInemTemplate = (sorting,isChecked) => {
  const {name, text} = sorting;
  return (`<li>
            <a href="#${name}" data-name="${name}" class="sort__button ${isChecked ? 'sort__button--active"' : '"'}>${text}</a>
          </li>`);
};

const createSortViewTemplate = (sortItems,current, isVisible) => {
  const sortItemsTemplate = sortItems
    .map((sorting) => createSortInemTemplate(sorting, sorting.name === current))
    .join('');

  return `<ul class="sort">
    ${isVisible ? sortItemsTemplate : ''}
    </ul>`;
};

export default class SortView extends AbstactView {
  #currentSortType;
  #isVisible;

  constructor(sortType, isVisible) {
    super();
    this.#currentSortType = sortType;
    this.#isVisible = isVisible;
  }

  get template() {
    return createSortViewTemplate(generateSorting(), this.#currentSortType, this.#isVisible);
  }

  setClickHandler = (callback) => {
    this._callback.filter = callback;
    this.element.querySelectorAll('.sort__button').forEach((button) => button.addEventListener('click', this.#handleSortButtonClick));
  };

  #handleSortButtonClick = (evt) => {
    evt.preventDefault();
    this._callback.filter(evt.target.dataset.name);
  };
}
