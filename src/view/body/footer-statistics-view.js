import AbstactView from '../../framework/view/abstract-view.js';

const createFooterStatisticsViewTemplate = (count) => (`<p>${count} movies inside</p>`);

export default class FooterStatisticsView extends AbstactView {
  #moviesCount;

  constructor(moviesCount) {
    super();
    this.#moviesCount = moviesCount;
  }

  get template() {
    return createFooterStatisticsViewTemplate(this.#moviesCount);
  }
}
