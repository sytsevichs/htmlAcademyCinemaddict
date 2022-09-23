import { MOVIES_INFO } from '../utils/const.js';
import { generateControls } from './control.js';
import { nanoid } from 'nanoid';

export const generateMovie = (index) => {
  const id = nanoid();
  return {
    id : id,
    filmInfo: MOVIES_INFO[index % MOVIES_INFO.length],
    controls: generateControls(id),
  };
} ;
