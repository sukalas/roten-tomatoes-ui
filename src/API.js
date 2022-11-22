const API = (() => {
  /* API CONSTANT DATA */
  const APIKey = $API_KEY; // Should use .env file in a node server
  this.page_num = 1;
  this.APIBaseURL = "https://api.themoviedb.org/3";
  this.APIKeyURL = `?api_key=${APIKey}`;
  this.APIPageQueryString = `&page=`;
  this.APISearchQueryString = `&query=`;

  this.endPoints = {
    movie: {
      now_playing: "/movie/now_playing",
      movie_id: "/movie/{movie_id}",
      movie_videos: "/movie/{movie_id}/videos",
      movie_reviews: "/movie/{movie_id}/reviews",
      movie_similar: "/movie/{movie_id}/similar",
    },
    genre: {
      movie_list: "/genre/movie/list",
    },
    search: {
      movie: "/search/movie",
    },
  };
  const fetchParams = {
    method: "GET",
    headers: {
      "x-rapidapi-key": APIKey,
    },
  };

  this.genreMovieList =
    this.APIBaseURL + this.endPoints.genre.movie_list + this.APIKeyURL;

  const updateURLs = () => {
    this.nowPlayingMovies =
      this.APIBaseURL +
      this.endPoints.movie.now_playing +
      this.APIKeyURL +
      this.APIPageQueryString +
      this.page_num;
    this.searchMovies =
      this.APIBaseURL +
      this.endPoints.search.movie +
      this.APIKeyURL +
      this.APISearchQueryString +
      State.keyword.key +
      this.APIPageQueryString +
      this.page_num;
    this.videos =
      this.APIBaseURL +
      this.endPoints.movie.movie_videos.replace("{movie_id}", State.movie.id) +
      this.APIKeyURL;
    this.reviews =
      this.APIBaseURL +
      this.endPoints.movie.movie_reviews.replace("{movie_id}", State.movie.id) +
      this.APIKeyURL;
    this.similar =
      this.APIBaseURL +
      this.endPoints.movie.movie_similar.replace("{movie_id}", State.movie.id) +
      this.APIKeyURL;
  };

  const getRequestJSON = async (URL = "nowPlayingMovies") => {
    updateURLs();
    const _URL = this[URL];
    return await fetch(_URL)
      .then((response) => {
        if (!response.ok) return Promise.reject(response);
        return response.json();
      })
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
  };

  const setPageNum = (num) => {
    this.page_num = num;
  };
  const getPageNum = () => {
    return this.page_num;
  };

  return {
    get: getRequestJSON,
    setPage: setPageNum,
    getPage: getPageNum,
  };
})();
