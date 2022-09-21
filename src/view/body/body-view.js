export default class bodyView {
  #element;
  constructor() {
    this.#element = document.querySelector('body');
  }

  get element() {
    return this.#element;
  }

  get header() {
    return this.#element.querySelector('.header__logo');
  }

  get main() {
    return this.#element.querySelector('main');
  }

  get footer() {
    return this.#element.querySelector('.footer__statistics');
  }

  hide() {
    this.#element.classList.remove('hide-overflow');
  }

  show() {
    this.#element.classList.add('hide-overflow');
  }
}
