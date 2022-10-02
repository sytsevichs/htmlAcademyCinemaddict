const MOVIES_NUMBER_DEFAULT = 15;
const MOVIES_NUMBER_PER_STEP = 5;
const COMMENTS_NUMBER_DEFAULT = 5;
const MINUTES_IN_HOUR = 60;

const END_POINT = 'https://18.ecmascript.pages.academy/cinemaddict';
const AUTHORITHATION = 'Basic 1qaz@WSX3edc$RFV5tgb';

const EMOTIONS = [
  {
    id: 1,
    name: 'smile'
  },
  {
    id: 2,
    name: 'puke'
  },
  {
    id: 3,
    name: 'sleeping'
  },
  {
    id: 4,
    name: 'angry'
  },
];

const CONTROL_TYPES = {
  watchlist: 0,
  watched: 1,
  favorite: 2,
};


const CONTROLS = [
  {
    detailsName: 'watchlist',
    name: 'watchlist',
    textUp: 'Add to watchlist',
    textDown: 'In watchlist',
  },
  {
    detailsName: 'already_watched',
    detailsDate: 'watching_date',
    name: 'watched',
    textUp: 'Mark as watched',
    textDown: 'Already watched',
  },
  {
    detailsName: 'favorite',
    name: 'favorite',
    textUp: 'Mark as favorite',
    textDown: 'In favorites',
  },
];

const SortType = {
  DEFAULT : 'default',
  DATE : 'date',
  RATING : 'rating'
};

const SORTING = [
  {
    name: SortType.DEFAULT,
    text: 'Sort by default',
  },
  {
    name: SortType.DATE,
    text: 'Sort by date',
  },
  {
    name: SortType.RATING,
    text: 'Sort by rating',
  },
];


const ACTIVE_CONTROL = 'active';

const MovieDescriptionLength = {
  min : 0,
  max : 139
};

const DateGenerationData = {
  year: 2012,
  month: 0,
  day: 1,
};

const FilterType = {
  all: 'all',
  watchlist: 'watchlist',
  history: 'watched',
  favorites: 'favorite',
};

const FilterName = {
  [FilterType.all]: 'All movies',
  [FilterType.watchlist]: 'Watchlist',
  [FilterType.history]: 'History',
  [FilterType.favorites]: 'Favorites',
};
const FilterMessage = {
  [FilterType.all]: 'There are no movies in our database',
  [FilterType.watchlist]: 'There are no movies to watch now',
  [FilterType.history]: 'There are no watched movies now',
  [FilterType.favorites]: 'There are no favorite movies now',
};

const UserAction = {
  UPDATE: 'UPDATE',
  ADD: 'ADD',
  DELETE: 'DELETE',
};

const UpdateType = {
  INIT:  'INIT',
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};


const MoviesUpdateGroup = {
  ALL: 'ALL',
  SINGLE: 'SINGLE',
};

const comments = [
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
];

const firstNames = [
  'Ivan',
  'Petr',
  'Sidor',
  'Vasily',
  'Semen',
];

const secondNames = [
  'Ivanov',
  'Petrov',
  'Sidorov',
  'Vasilyov',
  'Semenov',
];


export {
  MOVIES_NUMBER_DEFAULT,
  MOVIES_NUMBER_PER_STEP,
  COMMENTS_NUMBER_DEFAULT,
  MINUTES_IN_HOUR,
  AUTHORITHATION,
  END_POINT,
  EMOTIONS,
  CONTROL_TYPES,
  CONTROLS,
  ACTIVE_CONTROL,
  SORTING,
  MovieDescriptionLength,
  DateGenerationData,
  FilterType,
  FilterName,
  FilterMessage,
  SortType,
  UserAction,
  UpdateType,
  MoviesUpdateGroup,
  comments,
  firstNames,
  secondNames,
};
