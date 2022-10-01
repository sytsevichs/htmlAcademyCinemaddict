import {FilterType, UpdateType, UserAction} from '../utils/const.js';
import Observer from '../framework/observable.js';
import {FilterName} from '../utils/const.js';
import {filterData} from '../utils/filter.js';

export default class FilterModel extends Observer {
  #filters = null;
  #movies = null;

  constructor(movies) {
    super();
    this.#movies = movies;
  }

  get filters() {
    if (!this.#filters) {
      this.#filters = Object.entries(filterData).map(
        ([filterType, filterMovies]) => ({
          name: filterType,
          text: FilterName[filterType],
          active: filterType === FilterType.all,
          count: filterMovies(this.#movies).length,
        }));
    }
    return this.#filters;
  }

  set filters(filters) {
    this.#filters = filters;
    //Вызываем все обработчики, зарегистированные для обновления всех фильтров
    this._notify(UpdateType.MINOR, UserAction.UPDATE, this.#filters);
  }

  updateSingleFilter = (filterName) => {
    if (filterName !== FilterType.all){
      this.#filters.forEach((filter) => {
        if (filter.name === filterName) {
          filter.active = !filter.active;
        }
        if (filter.name === FilterType.all) {
          filter.active = false;
        }
      });
    }
    //Если сняли все дополнительные фильтры - взводим ALL
    if (!this.#filters.filter((filter) => filter.name !== FilterType.all).some((filter) => filter.active)){
      filterName = FilterType.all;
    }
    if (filterName === FilterType.all){
      this.#filters.forEach((filter) => {
        if (filter.name === filterName) {
          filter.active = true;
        } else {
          filter.active = false;
        }
      });
    }
    //Вызываем все обработчики, зарегистированные для обновления одного фильтра
    this._notify(UpdateType.MINOR, filterName, this.#filters);
  };

}
