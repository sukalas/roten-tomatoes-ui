export const State = {
  keyword: {
    key: "",
  },
  movie: {
    id: "",
    videos: {},
    similar: {},
    reviews: {},
  },
  movies: {
    results: [],
    page: 1,
  },
  dates: {
    maximum: "",
    minimum: "",
  },
  genres: {
    types: [],
  },
  getKey: async (URL) => {
    return fetch(URL)
      .then((res) => {
        return res.text();
      })
      .then((data) => JSON.parse(data))
      .catch((err) => console.error(err));
  },
};
