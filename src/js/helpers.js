import { API_KEY, options } from './config.js';

/**
 * Builds a full URL for a movie poster image based on the given path and size.
 *
 * This function uses the base URL for TMDB images and appends the specified size and poster path.
 *
 * @param {string} poster_path - The path of the movie poster image (from the TMDB API).
 * @param {string} size - The desired image size (e.g., 'w500', 'original').
 * @returns {string} The full URL to the movie poster image.
 */

export const buildPosterPath = (poster_path, size) => {
  const baseUrl = 'https://image.tmdb.org/t/p/';

  return `${baseUrl}${size}${poster_path}`;
};

/**
 * Fetches JSON data from a given API endpoint, appending the API key to the URL.
 *
 * This function uses the Fetch API to make a GET request and parses the response as JSON.
 * It includes error handling to throw an error if the fetch fails.
 *
 * @async
 * @param {string} url - The API endpoint URL (excluding the API key).
 * @returns {Promise<Object>} A promise resolving to the parsed JSON response.
 * @throws {Error} Throws an error if the fetch request fails.
 */

export const getJSON = async url => {
  const url_w_api_key = `${url}&api_key=${API_KEY}`;

  try {
    const res = await fetch(url_w_api_key, options);

    return await res.json();
  } catch (error) {
    throw Error(error);
  }
};

/**
 * Creates a debounced version of a function that delays its execution until after a specified delay.
 *
 * This function prevents rapid-fire calls to a function by enforcing a delay period.
 * If the returned function is called again before the delay ends, the timer resets.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The delay period in milliseconds.
 * @returns {Function} A debounced version of the original function.
 */

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
