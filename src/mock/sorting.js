import { SORTING } from '../utils/const.js';

export const generateSorting = () => Object.values(SORTING).map(
  (sorting) =>({
    name: sorting.name,
    text: sorting.text,
  })
);
