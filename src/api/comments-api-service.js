import ApiService from '../framework/api-service';
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export default class CommentsApiService extends ApiService {
  #movieId;

  constructor(movieId, endPoint, authorization ) {
    super(endPoint, authorization);
    this.#movieId = movieId;
  }

  get comments() {
    return this._load({url: `comments/${this.#movieId}`}).then(ApiService.parseResponse);
  }

  addComment = async(comment) => {
    const response = await this._load({
      url: `comments/${this.#movieId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type':'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

  deleteComment = async(comment) => await this._load({
    url: `comments/${comment.id}`,
    method: Method.DELETE,
  });
}
