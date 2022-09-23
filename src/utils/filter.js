import {CONTROL_TYPES,FilterType} from './const';

const filter = {
  [FilterType.all]: (movies) => (movies),
  [FilterType.watchlist]: (movies) => movies.filter((movie) => movie.controls[CONTROL_TYPES.watchlist].active ),
  [FilterType.history]: (movies) => movies.filter((movie) => movie.controls[CONTROL_TYPES.watched].active ),
  [FilterType.favorites]: (movies) => movies.filter((movie) => movie.controls[CONTROL_TYPES.favorite].active ),
};

export {filter};
