import { firstNames, secondNames,comments, EMOTIONS} from './const.js';
import { getRandomDate, getRandomInteger } from './utils.js';

export const generateComment = (id,movieId) => ({
  id,
  movieId,
  author:  `${firstNames[getRandomInteger(0,firstNames.length - 1)]} ${secondNames[getRandomInteger(0,secondNames.length - 1)]}`,
  text: comments[getRandomInteger(0,comments.length - 1)],
  date: getRandomDate(new Date(2012, 0, 1), new Date()),
  emoji: EMOTIONS[getRandomInteger(0,EMOTIONS.length - 1)].name,
});