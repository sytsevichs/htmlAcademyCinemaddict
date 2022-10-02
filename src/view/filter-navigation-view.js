import AbstactView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, text, count} = filter;
  return (`<a href="#${name}"  class="main-navigation__item ${isChecked ? 'main-navigation__item--active"' : '"'} " data-name="${name}">${text} <span class="main-navigation__item-count">${count}</span></a>` );
};

const createFilterNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, filter.active))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    </nav>`;
};
export default class FilterNavigationView extends AbstactView {
  #filters;
  #currentFilter;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterNavigationTemplate(this.#filters);
  }

  setClickHandler = (callback) => {
    this._callback.filter = callback;
    this.element.querySelectorAll('.main-navigation__item').forEach((button) => button.addEventListener('click', this.#handleFilterClick));
  };

  #handleFilterClick = (evt) => {
    evt.preventDefault();
    this._callback.filter(evt.target.dataset.name);
  };

}
