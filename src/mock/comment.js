import { nanoid } from 'nanoid';
import { firstNames, secondNames,comments, EMOTIONS, DateGenerationData} from '../utils/const.js';
import { getRandomDate, getRandomInteger } from '../utils/utils.js';

export const generateComment = (movieId) => {
  const id = nanoid();
  return {
    id: id,
    movieId,
    author:  `${firstNames[getRandomInteger(0,firstNames.length - 1)]} ${secondNames[getRandomInteger(0,secondNames.length - 1)]}`,
    text: comments[getRandomInteger(0,comments.length - 1)],
    date: getRandomDate(new Date(DateGenerationData.year, DateGenerationData.month, DateGenerationData.day), new Date()),
    emoji: EMOTIONS[getRandomInteger(0,EMOTIONS.length - 1)].name,
  };
};
