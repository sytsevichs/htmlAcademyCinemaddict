import AbstactView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (filter, isChecked) => {
  const {name, count} = filter;
  return (`<a href="#${name}" enabled="${isChecked}" class="main-navigation__item">${name} <span class="main-navigation__item-count">${count}</span></a>` );
};

const createFilterNavigationTemplate = (filterItems) => {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
    .join('');

  return `<nav class="main-navigation">
    ${filterItemsTemplate}
    </nav>`;
};
export default class FilterNavigationView extends AbstactView {
  #filters;

  constructor(filters) {
    super();
    this.#filters = filters;
  }

  get template() {
    return createFilterNavigationTemplate(this.#filters);
  }
}
