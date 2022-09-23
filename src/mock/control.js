import {
  CONTROLS
} from '../utils/const.js';
import {
  getRandomInteger
} from '../utils/utils.js';

export const generateControls = (id) => Object.entries(CONTROLS).map(
  ([index, control]) =>{
    const active = !!getRandomInteger(0, 1);
    return {
      id,
      index: index,
      name: control.name,
      active: active,
      text: active ? control.textDown : control.textUp,
    };
  }
);
