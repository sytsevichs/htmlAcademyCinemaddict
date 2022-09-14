import { MOVIES_INFO } from './const.js';

export const generateMovie = (id) => {
  let internalId = id;
  while ( MOVIES_INFO.length <= internalId ) {internalId -= MOVIES_INFO.length; }
  return {
    id,
    filmInfo : MOVIES_INFO[internalId],
  };
};
