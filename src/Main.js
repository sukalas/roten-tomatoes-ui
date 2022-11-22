const Main = (() => {
  // INITIALIZING
  const init = async () => {
    const playigNowMoviesPromise = _fetch("nowPlayingMovies");
    const genresListPromise = _fetch("genreMovieList");
    Promise.all([playigNowMoviesPromise, genresListPromise]).then(
      ([playigNowMoviesResponse, genresListResponse]) => {
        State.movies = playigNowMoviesResponse;
        State.genres.types = genresListResponse.genres;
        State.playingNowdatesRange = State.movies.dates; // Store the date range
        _renderMoviesResults();
        _attachDocumentListeners();
      }
    );
  };
  // FETCHING
  const _fetch = async (URL) => {
    return await API.get(URL);
  };
  // RENDERING
  const _renderMoviesResults = () => {
    if (State.movies.results) {
      DOM.appendMovieList({
        data: State.movies.results,
      });
    }
  };
  const _renderMovieDetailsResults = () => {
    DOM.appendMovieDetails();
  };
  // DOM LISTENERS
  const _attachDocumentListeners = () => {
    document.addEventListener("scroll", _detectScrollBottom);
    document.body.addEventListener("click", (e) => {
      _closeExpandedMovies();
    });
    document
      .querySelector(".search__input")
      .addEventListener("keyup", _handleSearch);
    document.addEventListener("touchstart", () => {}, true);
  };
  const _detectScrollBottom = (e) => {
    const element = e.target;
    if (!Helpers.hasScrolledToTheBottom(element)) return;
    let isCustomSearch = State.keyword.key.length ? true : false;
    let URL = isCustomSearch ? "searchMovies" : "nowPlayingMovies";
    _fetch(URL).then((response) => {
      const beforeTheLastPage = API.getPage() < response.total_pages;
      if (!beforeTheLastPage) return;
      API.setPage(API.getPage() + 1);
      State.movies = response;
      _renderMoviesResults();
    });
  };
  // SEARCH
  const _handleSearch = (e) => {
    State.keyword.key = e.target.value;
    if (State.keyword.key.length > 2) {
      API.setPage(1);
      _fetch("searchMovies").then((searchMoviesResponse) => {
        _clearPageResults();
        State.movies = searchMoviesResponse;
        _renderMoviesResults();
      });
    } else if (State.keyword.key.length === 0) {
      _clearPageResults();
      API.setPage(1);
      _fetch("nowPlayingMovies").then((playigNowMoviesResponse) => {
        State.movies = playigNowMoviesResponse;
        _renderMoviesResults();
      });
    }
  };
  // TOGGLING VIEW NORMAL <=> DETAILED
  const toggleDetailedView = (e) => {
    // If we are closing the card just close it and abort the rest logic
    if (e.target.classList.contains("expanded")) {
      _closeExpandedMovies();
      return false;
    }
    // Reset all except the one we clicked
    document.querySelectorAll(".movie", document.body).forEach((article) => {
      if (article.id === e.target.id) return false;
      article.classList.remove("expanded");
    });
    // Toggle the clicked
    e.target.classList.toggle("expanded");
    // If we are clicking the last item abort
    if (Number(State.movie.id) === Number(e.target.id.replace("movie-", ""))) {
      return false;
    }
    // Store the clicked movie's id
    State.movie.id = e.target.id.replace("movie-", "");

    const videosPromise = _fetch("videos");
    const similarPromise = _fetch("similar");
    const reviewsPromise = _fetch("reviews");

    Promise.all([videosPromise, similarPromise, reviewsPromise]).then(
      ([videosRespose, similarResponse, reviewsResponse]) => {
        State.movie.videos = videosRespose;
        State.movie.similar = similarResponse;
        State.movie.reviews = reviewsResponse;
        _renderMovieDetailsResults();
      }
    );
  };
  const _closeExpandedMovies = () => {
    document.querySelectorAll(".movie", document.body).forEach((article) => {
      if (article.classList.contains("expanded"))
        article.classList.remove("expanded");
    });
  };
  const _clearPageResults = () => {
    const elements = document.body.querySelectorAll("article");
    for (let i = 0; i < elements.length; i++) {
      elements[i].remove();
    }
    State.movies = {};
  };
  return {
    init: init,
    toggleDetailedView: toggleDetailedView,
  };
})();
