import ApiService from '../framework/api-service';
const Method = {
  GET: 'GET',
  PUT: 'PUT'
};

export default class MoviesApiService extends ApiService {
  get movies() {
    return this._load({url: 'movies'}).then(ApiService.parseResponse);
  }

  updateMovie = async(movie) => {
    const response = await this._load({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(this.#adaptToServer(movie)),
      headers: new Headers({'Content-Type':'application/json'}),
    });
    const parsedResponse = await ApiService.parseResponse(response);
    return parsedResponse;
  };


  #adaptToServer = (movie) => {
    const adaptedMovie = {
      id: movie.id,
      'film_info': this.#adaptMovieInfo(movie.filmInfo),
      'user_details': this.#adaptMovieControls(movie.controls),
      comments: movie.comments,
    };
    return adaptedMovie;
  };

  #adaptMovieInfo = (movieInfo) => {
    const adaptedMovieInfo = {...movieInfo,
      'alternative_title' : movieInfo.alternativeTitle,
      'total_rating' : movieInfo.totalRating,
      'age_rating' : movieInfo.ageRating,
      release: {
        date: movieInfo.release.date,
        'release_country' : movieInfo.release.releaseCountry,
      },
    };
    delete adaptedMovieInfo.alternativeTitle;
    delete adaptedMovieInfo.totalRating;
    delete adaptedMovieInfo.ageRating;
    return adaptedMovieInfo;
  };

  #adaptMovieControls = (movieControls) => {
    const controls = {
      'watchlist' : movieControls[movieControls.findIndex((item) => item.name === 'watchlist')].active,
      'already_watched' : movieControls[movieControls.findIndex((item) => item.name === 'watched')].active,
      'watching_date' : movieControls[movieControls.findIndex((item) => item.name === 'watched')].date,
      'favorite' : movieControls[movieControls.findIndex((item) => item.name === 'favorite')].active,
    };
    return controls;
  };

}
