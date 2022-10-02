import ApiService from '../framework/api-service';
const Method = {
  GET: 'GET',
  PUT: 'PUT',
  CREATE: 'CREATE',
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

  addComment = async(comments) => {
    const response = await this._load({
      url: `comments/${this.#movieId}`,
      method: Method.PUT,
      body: JSON.stringify(comments),
      headers: new Headers({'Content-Type':'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };

}
