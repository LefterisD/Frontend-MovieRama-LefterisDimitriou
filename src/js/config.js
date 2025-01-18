export const API_KEY = 'bc50218d91157b1ba4f142ef7baaa6a0';
export const NOW_PLAYING_URL = (page) =>
    `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}&api_key=${API_KEY}`;

//test id 933260
// const MOVIE_REVIEWS_URL = (id) => `https://api.themoviedb.org/3/movie/${id}/reviews?language=en-US&page=1&api_key=${API_KEY}`;
// const MOVIE_VIDEOS_URL = (id) => `https://api.themoviedb.org/3/movie/${id}/videos?language=en-US&api_key=${API_KEY}`;
// const MOVIE_SIMILAR_URL = (id) => `https://api.themoviedb.org/3/movie/${id}/similar?language=en-US&page=1&api_key=${API_KEY}`;


export const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer bc50218d91157b1ba4f142ef7baaa6a0',
    },
  };