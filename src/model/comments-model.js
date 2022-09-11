import { COMMENTS_NUMBER_DEFAULT } from '../mock/const.js';
import { generateComment } from '../mock/comment.js';
import { getRandomInteger } from '../mock/utils.js';

export default class CommentsModel {
  constructor(movieId) {
    this.movieId = movieId;
  }

  comments = Array.from({length: getRandomInteger(0,COMMENTS_NUMBER_DEFAULT)}, (a,index) => generateComment(index, this.movieId));
  getComments = () => this.comments;
}
