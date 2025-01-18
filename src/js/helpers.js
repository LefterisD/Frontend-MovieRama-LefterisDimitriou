import { options } from './config.js';

// const trailerKey = "DnJA5hMf4rE"; // From the response
// const youtubeUrl = `https://www.youtube.com/watch?v=${trailerKey}`;

export const buildPosterPath = (poster_path, size) => {
  const baseUrl = 'https://image.tmdb.org/t/p/';

  return `${baseUrl}${size}${poster_path}`;
};

export const getJSON = async url => {
  try {
    const res = await fetch(url, options);

    return await res.json();
  } catch (error) {
    throw Error(error);
  }
};
