import AbstactView from '../framework/view/abstract-view.js';

const createLoadingTemplate = () => (
  `<h2 class="films-list__title">
    Loading...
  </h2>`);

export default class LoadingView extends AbstactView {
  get template() {
    return createLoadingTemplate();
  }
}
