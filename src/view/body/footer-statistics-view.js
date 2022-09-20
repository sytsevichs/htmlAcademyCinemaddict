import AbstactView from '../../framework/view/abstract-view.js';

const createFooterStatisticsViewTemplate = () => ('<p>130 291 movies inside</p>');

export default class FooterStatisticsView extends AbstactView {
  get template() {
    return createFooterStatisticsViewTemplate();
  }
}
