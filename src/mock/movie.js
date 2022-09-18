import { MOVIES_INFO } from './const.js';

export const generateMovie = (id) => ({
  id,
  filmInfo: MOVIES_INFO[id % MOVIES_INFO.length],
});
