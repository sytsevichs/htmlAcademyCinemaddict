import AbstactView from '../framework/view/abstract-view.js';
import { generateSorting } from '../mock/sorting.js';

const createSortInemTemplate = (sorting,isChecked) => {
  const {name, text} = sorting;
  return (`<li>
            <a href="#${name}" data-name="${name}" class="sort__button ${isChecked ? 'sort__button--active"' : '"'}>${text}</a>
          </li>`);
};

const createSortViewTemplate = (sortItems,current) => {
  const sortItemsTemplate = sortItems
    .map((sorting) => createSortInemTemplate(sorting, sorting.name === current))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
    </ul>`;
};

export default class SortView extends AbstactView {
  #currentSortType;

  constructor(sortType) {
    super();
    this.#currentSortType = sortType;
  }

  get template() {
    return createSortViewTemplate(generateSorting(), this.#currentSortType);
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
