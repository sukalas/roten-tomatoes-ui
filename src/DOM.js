import { State } from "./State.js";
import { toggleDetailedView } from "./Main.js";
import { escapeSpecialCharacters } from "./Helpers.js";

/* OTHER VARIABLES */
const fragment = new DocumentFragment(); // Using fragment reduces the DOM drawing iterations
const posterBaseURL = "https://image.tmdb.org/t/p/";
let similarMoviesParentHTML,
  similarMovieParentHTML = "";

const _templates = {
  articleContent: (data) => {
    const dateObj = new Date(data.release_date);
    const year = dateObj.getFullYear();
    const genreStringHTML = _filterGenreList(data.genre_ids);
    const poster_path = data.poster_path
      ? data.poster_path
      : data.backdrop_path;
    const posterBackground = poster_path
      ? `style="background-image: url(${posterBaseURL}w500${poster_path}"`
      : "";

    let isPlayingNow =
      dateObj <= new Date(State.playingNowdatesRange.maximum) &&
      dateObj >= new Date(State.playingNowdatesRange.minimum);
    return `
      <div class="movie__poster" ${posterBackground}></div>
      <span class="movie__labels">
        <span class="movie__labels--rating">
          <i title="rating=${Number(data.vote_average).toFixed(
            2
          )}" data-star="${Number(data.vote_average).toFixed(2)}"></i>
        </span>
        <span class="movie__labels--in-theaters"
          style="${isPlayingNow ? "display:flex;" : "display:none;"}">
         now in the theaters
        </span>
        ${genreStringHTML}
      </span>
      <div class="movie__info">
        <h3 class="movie__info__title" title="${data.title}">${data.title}</h3>
        <div class="movie__info__release-date">Release year: ${year}</div>
        <p class="movie__info__overview">${data.overview}</p>
      </div>
  `;
  },
  detailsContent: () => {
    let reviewsHTML = "";
    let iframesHTML = "";

    if (State.movie.reviews && State.movie.reviews.total_results) {
      const isSmaller = (a, b) =>
        a.content.length < b.content.length ? -1 : 1;
      const sortedReviews = State.movie.reviews.results.sort(isSmaller);
      sortedReviews
        .slice(0, 1)
        .forEach(
          (review) => (reviewsHTML += _templates.reviewsTemplate(review))
        );
    } else {
      reviewsHTML = `<div class="movie__details__reviews">
      <p class="movie__details__reviews--content">No reviews available</p>
      </div>`;
    }
    if (State.movie.videos) {
      State.movie.videos.results
        .slice(0, 1)
        .forEach(
          (trailer) => (iframesHTML += _templates.trailersTemplate(trailer))
        );
    }

    if (State.movie.similar) {
      similarMoviesParentHTML = _templates.similarMoviesTemplate(
        State.movie.similar.results
      );
    }

    return iframesHTML + reviewsHTML + similarMoviesParentHTML;
  },
  reviewsTemplate: ({ author, content }) => {
    const parsedTitle = escapeSpecialCharacters(content);
    return `
    <div class="movie__details__reviews">
      <h3 class="movie__details__reviews--author">${author}</h3>
      <p class="movie__details__reviews--content" title="${parsedTitle}">${content}</p>
    </div>`;
  },
  trailersTemplate: ({ name, key }) => {
    // Video ratio: 1.777
    const baseURL = "https://www.youtube.com/embed/";
    const parsedTitle = escapeSpecialCharacters(name);
    return `
      <div class="movie__details__trailer">
        <h3 class="movie__details__trailer--title" title="${parsedTitle}">${name}</h3>
        <iframe class="movie__details__trailer--video" width="100%" height="70%"
          src="${baseURL + key}">
        </iframe>
      </div>
  `;
  },
  similarMoviesTemplate: (similarMovies) => {
    let similarMoviesHTML = "";
    similarMovies
      .slice(0, 3)
      .forEach(
        (similarMovie) =>
          (similarMoviesHTML += _templates.similarMovieTemplate(similarMovie))
      );
    similarMovieParentHTML = `
    <div class="movie__details__similar-container">
      <h3 class="movie__details__similar-title">Similar movies: </h3>
      <div class="movie__details__similar-movies">
        ${similarMoviesHTML}
      </div>
    </div>
      `;
    return similarMovieParentHTML;
  },
  similarMovieTemplate: ({ title, poster_path, vote_average }) => {
    const parsedTitle = escapeSpecialCharacters(title);
    return `
      <div class="movie__details__similar-movies__movie">
        <h3 class="movie__details__similar-movies__movie--title" title="${parsedTitle}">${title}</h3>
        <div class="movie__details__similar-movies__movie--poster" style="background-image: url(${posterBaseURL}w200${poster_path})"></div>
        <div class="movie__details__similar-movies__movie--rating">
          <span class="movie__labels--rating">
                <i title="rating=${vote_average}" data-star="${vote_average}"></i>
          </span>
        </div>
      </div>
  `;
  },
};
const _filterGenreList = (ids) => {
  let genres_html = "";
  ids.forEach((id) => {
    genres_html += State.genres.types
      .filter((list) => list.id === id)
      .map((genre) => {
        return `
        <span class="movie__labels--genre">
          ${genre.name}
        </span>`;
      });
  });
  return genres_html;
};

const appendMovieList = ({ data, data2 }) => {
  for (let i = 0; i < data.length; i++) {
    const article = document.createElement("article");
    article.classList.add("movie");
    article.id = "movie-" + data[i].id;
    article.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleDetailedView(e);
    });
    fragment.append(article);
    const html = _templates.articleContent(data[i], data2, i);
    fragment.querySelectorAll("article")[i].innerHTML = html;
  }
  document.body.querySelector(".movies-list__container").append(fragment); // Drawing DOM only once per iteration loop
};
const appendMovieDetails = () => {
  const moveDetailsPrevious = document
    .getElementById(`movie-${State.movie.id}`)
    .querySelector(".movie__details");
  if (moveDetailsPrevious) {
    return;
  }
  const div = document.createElement("div");
  div.classList.add("movie__details");
  div.innerHTML = _templates.detailsContent();
  document.body.querySelector(`#movie-${State.movie.id}`).append(div);
};

export { appendMovieList, appendMovieDetails };
