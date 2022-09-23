import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { MINUTES_IN_HOUR } from './const';

dayjs.extend(duration);

//Обработка клавиш
const isEscapeKey = (evt) => evt.key === 'Escape';

const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const formatDateToYear = (date) => dayjs(date).format('YYYY');
const formatDateDescription = (date) => dayjs(date).format('YYYY/MM/DD HH:MM');
const formatMinutesToTime = (minutes) => dayjs.duration(minutes, 'minutes').format(minutes < MINUTES_IN_HOUR ? 'mm[m]' : 'H[h] mm[m]') ;
const defineGenresDescrition = (amount) => amount === 1 ? 'Genre' : 'Genres';

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

export {
  isEscapeKey,
  getRandomDate,
  getRandomInteger,
  formatDateToYear,
  formatDateDescription,
  formatMinutesToTime,
  defineGenresDescrition,
  updateItemById,
  updateItemByName,
};
