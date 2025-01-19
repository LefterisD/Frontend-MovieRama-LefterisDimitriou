import { API_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  nowPlaying: [],
  page: 1,
  search: {
    query: '',
    results: [],
  },
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
