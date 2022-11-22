const State = (() => {
  this.keyword = {
    key: "",
  };
  this.movie = {
    id: "",
    videos: {},
    similar: {},
    reviews: {},
  };
  this.movies = {
    results: [],
    page: 1,
  };
  this.dates = {
    maximum: "",
    minimum: "",
  };
  this.genres = {
    types: [],
  };

  return {
    movie: this.movie,
    movies: this.movies,
    genres: this.genres,
    keyword: this.keyword,
  };
})();
