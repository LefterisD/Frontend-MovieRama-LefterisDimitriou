import { API_KEY, options } from './config.js';

export const buildPosterPath = (poster_path, size) => {
  const baseUrl = 'https://image.tmdb.org/t/p/';

  return `${baseUrl}${size}${poster_path}`;
};

export const getJSON = async (url) => {
  const url_w_api_key = `${url}&api_key=${API_KEY}`;

  try {
    const res = await fetch(url_w_api_key, options);

    return await res.json();
  } catch (error) {
    throw Error(error);
  }
};

export const debounce = (func, delay) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      try {
        await func(...args);
      } catch (err) {
        console.error(err);
      }
    }, delay);
  };
};


