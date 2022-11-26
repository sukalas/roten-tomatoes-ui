import { State } from "./State.js";

/* API CONSTANT DATA */
const APIKey = "bc50218d91157b1ba4f142ef7baaa6a0"; // Should use .env file in a node server
let page_num = 1;
const APIBaseURL = "https://api.themoviedb.org/3";
const APIKeyURL = `?api_key=${APIKey}`;
const APIPageQueryString = `&page=`;
const APISearchQueryString = `&query=`;
const endPoints = {
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

let composeAPIURLS = () => {
  const CONFIG = {
    nowPlayingMovies:
      APIBaseURL +
      endPoints.movie.now_playing +
      APIKeyURL +
      APIPageQueryString +
      page_num,
    genreMovieList: APIBaseURL + endPoints.genre.movie_list + APIKeyURL,
    searchMovies:
      APIBaseURL +
      endPoints.search.movie +
      APIKeyURL +
      APISearchQueryString +
      State.keyword.key +
      APIPageQueryString +
      page_num,
    videos:
      APIBaseURL +
      endPoints.movie.movie_videos.replace("{movie_id}", State.movie.id) +
      APIKeyURL,
    reviews:
      APIBaseURL +
      endPoints.movie.movie_reviews.replace("{movie_id}", State.movie.id) +
      APIKeyURL,
    similar:
      APIBaseURL +
      endPoints.movie.movie_similar.replace("{movie_id}", State.movie.id) +
      APIKeyURL,
  };
  return {
    nowPlayingMovies: CONFIG.nowPlayingMovies,
    genreMovieList: CONFIG.genreMovieList,
    searchMovies: CONFIG.searchMovies,
    videos: CONFIG.videos,
    reviews: CONFIG.reviews,
    similar: CONFIG.similar,
  };
};

const get = async (URL = "nowPlayingMovies") => {
  const _URL = composeAPIURLS()[URL];
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
  page_num = num;
};
const getPageNum = () => {
  return page_num;
};

export { get, getPageNum, setPageNum };
