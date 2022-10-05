import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import Randomstring from 'randomstring';
import { ERROR_TYPE, MINUTES_IN_HOUR } from './const';

dayjs.extend(duration);

//Обработка клавиш
const isEscapeKey = (evt) => evt.key === 'Escape';

const formatDateToYear = (date) => dayjs(date).format('YYYY');
const formatDateDescription = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const formatMinutesToTime = (minutes) => dayjs.duration(minutes, 'minutes').format(minutes < MINUTES_IN_HOUR ? 'mm[m]' : 'H[h] mm[m]') ;
const defineGenresDescription = (amount) => amount === 1 ? 'Genre' : 'Genres';

const updateItemByIndex = (items, updatedItem, index) => {
  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    updatedItem,
    ...items.slice(index + 1),
  ];
};

const updateItemById = (items, updatedItem) => {
  const index = items.findIndex((item) => item.id === updatedItem.id);
  return updateItemByIndex(items, updatedItem, index);
};

const updateItemByName = (items, updatedItem) => {
  const index = items.findIndex((item) => item.name === updatedItem.name);
  return updateItemByIndex(items, updatedItem, index);
};

const getWeightForNull = (valueA, valueB) => {
  if (valueA === null && valueB === null) {
    return 0;
  }

  if (valueA === null) {
    return 1;
  }

  if (valueB === null) {
    return -1;
  }

  return null;
};

const sortByDateUp = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.release.date, movieB.filmInfo.release.date);

  return weight ?? dayjs(movieA.filmInfo.release.date).diff(dayjs(movieB.filmInfo.release.date));
};

const sortByDateDown = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.release.date, movieB.filmInfo.release.date);

  return weight ?? dayjs(movieB.filmInfo.release.date).diff(dayjs(movieA.filmInfo.release.date));
};

const sortByRatingUp = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);

  return weight ?? movieA.filmInfo.totalRating - movieB.filmInfo.totalRating;
};

const sortByRatingDown = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.filmInfo.totalRating, movieB.filmInfo.totalRating);

  return weight ?? movieB.filmInfo.totalRating - movieA.filmInfo.totalRating;
};

const sortByComments = (movieA, movieB) => {
  const weight = getWeightForNull(movieA.comments.length, movieB.comments.length);

  return weight ?? movieB.comments.length - movieA.comments.length;
};

const setAborting = (component,shake = true) => {
  if (shake) {
    component.shake();
  }
  const resetFormState = () => {
    component.updateElement({
      isSaving: false,
      isDeleting: null,
    });
  };

  component.shake(resetFormState);
};

const authorization = () => `Basic ${new Randomstring.generate()}`;

const errorHeadling = (error, object) => {
  switch (error.message.split(':')[0]) {
    case ERROR_TYPE.AUTHORIZATION.code:
      this.messageText = ERROR_TYPE.AUTHORIZATION.text;
      break;
    case ERROR_TYPE.NOTFOUND.code:
      this.messageText = ERROR_TYPE.NOTFOUND.text;
      break;
    default:
      this.messageText = `${ERROR_TYPE.DEFAULT.text} ${object}:`;
      break;
  }
  throw new Error(`${this.messageText} ${error}`);
};

export {
  isEscapeKey,
  formatDateToYear,
  formatDateDescription,
  formatMinutesToTime,
  defineGenresDescription,
  updateItemById,
  updateItemByName,
  sortByDateUp,
  sortByDateDown,
  sortByRatingUp,
  sortByRatingDown,
  sortByComments,
  setAborting,
  authorization,
  errorHeadling,
};
