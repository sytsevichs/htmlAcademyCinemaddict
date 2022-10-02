import { SORTING } from './const.js';

export const generateSorting = () => Object.values(SORTING).map(
  (sorting) =>({
    name: sorting.name,
    text: sorting.text,
  })
);
