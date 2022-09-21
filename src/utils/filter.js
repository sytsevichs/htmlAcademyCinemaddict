import {FilterType, MINUTES_IN_HOUR} from './const';

const filter = {
  [FilterType.all]: (movies) => (movies),
  [FilterType.watchlist]: (movies) => movies.filter((movie) => movie.filmInfo.runtime > MINUTES_IN_HOUR),
  [FilterType.history]: (movies) => movies.filter((movie) => movie.filmInfo.runtime < MINUTES_IN_HOUR),
  [FilterType.favorites]: (movies) => movies.filter((movie) => movie.filmInfo.runtime === MINUTES_IN_HOUR),
};

export {filter};
