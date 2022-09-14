import {createElement} from '../render.js';

const createFooterStatisticsTemplate = () => ('<p>130 291 movies inside</p>');

export default class FooterStatistics {
  #element;
  getTemplate() {
    return createFooterStatisticsTemplate();
  }

  get element() {
    if (!this.#element) {
      this.#element = createElement(this.getTemplate());
    }
    return this.#element;
  }

  removeElement() {
    this.#element = null;
  }
}
