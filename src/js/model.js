import { NOW_PLAYING_URL } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  nowPlaying: [],
};
let isFetching = false;
let page = 1;

export const fetchPlayingNowMovies = async () => {
  if (isFetching) return; // Prevent multiple fetches at the same time
  isFetching = true;

  try {
    const data = await getJSON(NOW_PLAYING_URL(page));
    const movies = data.results;

    state.nowPlaying.push(...movies);

    console.log(movies);
    isFetching = false;
    page++;
    return movies;
  } catch (error) {
    isFetching = false;
    console.error(error);
  }
};
