import { API_KEY, API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  nowPlaying: [],
  genres: [],
  page: 1,
  search: {
    query: '',
    results: [],
  },
  selectedMovie: {
    reviews:[],
    videos:[],
    similar:[]
  }
};
let isFetching = false;

export const fetchPlayingNowMovies = async () => {
  if (isFetching) return; // Prevent multiple fetches at the same time
  isFetching = true;

  try {
    const data = await getJSON(
      `${API_URL}movie/now_playing?language=en-US&page=${state.page}`,
    );
    const movies = data.results;

    state.nowPlaying.push(...movies);

    console.log(movies);
    isFetching = false;
    state.page++;
  } catch (error) {
    isFetching = false;
    console.error(error);
  }
};

export const loadSearchResults = async query => {
  if (isFetching) return; // Prevent multiple fetches at the same time
  isFetching = true;

  try {
    const data = await getJSON(
      `${API_URL}search/movie?include_adult=false&language=en-US&page=${state.page}&query=${query}`,
    );
    const movies = data.results;
    state.search.results.push(...movies);

    console.log(movies);
    isFetching = false;
    state.page++;
  } catch (error) {
    isFetching = false;
    console.error(error);
  }
};

export const loadMovieGenres = async () => {
  try {
    const data = await getJSON(
      `${API_URL}genre/movie/list?api_key=${API_KEY}&language=en-US`,
    );
    const { genres } = data;

    state.genres = genres;
  } catch (error) {
    console.error(error);
  }
};

export const loadMovieReviews = async id => {
  try {
    const data = await getJSON(
      `${API_URL}movie/${id}/reviews?language=en-US&page=1`,
    );

    console.log(data);
    const reviews = data.results.slice(0, 2);

    state.selectedMovie.reviews = reviews;
  } catch (error) {
    console.error(error);
  }
};

export const loadMovieVideos = async id => {
  try {
    const data = await getJSON(
      `${API_URL}movie/${id}/videos?language=en-US`,
    );
    const videos = data.results.filter(video => video.type === 'Trailer');
    console.log(videos);
    state.selectedMovie.videos = videos;
  } catch (error) {
    console.error(error);
  }
};

export const loadMovieSimilar = async id => {
  try {
    const data = await getJSON(
      `${API_URL}movie/${id}/similar?language=en-US&page=1`,
    );

    console.log(data);
    state.selectedMovie.similar = data.results.slice(0,6);
  } catch (error) {
    console.error(error);
  }
};
