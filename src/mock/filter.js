
import { FilterName } from '../utils/const.js';
import {filter} from '../utils/filter.js';
const getFilterName = (type) => FilterName[type];

export const generateFilter = (movies) => Object.entries(filter).map(
  ([filterType, filterMovies]) => ({
    name: filterType,
    text: getFilterName(filterType),
    count: filterMovies(movies).length,
  }),
);
