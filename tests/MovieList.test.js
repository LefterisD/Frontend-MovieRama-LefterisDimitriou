// import fs from 'fs';
// import path from 'path';
// import { JSDOM } from 'jsdom'; // This should be correct
// import { getByText } from '@testing-library/dom';

// Object.assign(global, { TextDecoder, TextEncoder });

// const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

// describe('MovieList', () => {
//   let dom;
//   let document;

//   beforeEach(() => {
//     // Set up a new JSDOM instance
//     dom = new JSDOM(html);
//     document = dom.window.document;
//   });

//   it('renders a title', () => {
//     expect(
//       document.querySelector('.header__container__title'),
//     ).toBeInTheDocument();

//     expect(document.querySelector('.movie__list__header')).toBeInTheDocument();
//   });
// });

import { screen } from '@testing-library/dom';
import fs from 'fs';
import path from 'path';
import * as model from '../src/js/model.js';
import { getJSON } from '../src/js/helpers.js';

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('MovieList', () => {
  jest.mock('../src/js/helpers.js', () => ({
    getJSON: jest.fn(),
  }));

  beforeEach(() => {

    getJSON.mockResolvedValue({
      results: [
        {
          id: 1,
          title: 'Movie 1',
          vote_average: 7.5,
          release_date: '2024-01-01',
          overview: 'This is a movie description',
          poster_path: '/path/to/poster',
          genre_ids: [1, 2],
        },
        {
          id: 2,
          title: 'Movie 2',
          vote_average: 8.1,
          release_date: '2024-02-01',
          overview: 'This is another movie description',
          poster_path: '/path/to/poster2',
          genre_ids: [3, 4],
        },
      ],
    });

    document.body.innerHTML = html;
  });

  it('renders a title', () => {
    const title = screen.getAllByText('MovieRama');
    expect(title[1]).toBeInTheDocument();
  });

  it('renders the header Playing this week text', () => {
    const header = screen.getByText('Playing this week');
    expect(header).toBeInTheDocument();
  });

  it('fetches now playing movie and renders them on screen', async () => {
    await model.fetchPlayingNowMovies();

    expect(getJSON).toHaveBeenCalledTimes(1);
    expect(getJSON).toHaveBeenCalledWith(expect.stringContaining('movie/now_playing'));

    const movieTitles = document.querySelectorAll('.movie__title');

    expect(movieTitles).toHaveLength(2);
    expect(movieTitles[0].textContent).toBe('Movie 1');
    expect(movieTitles[1].textContent).toBe('Movie 2');
  });
});
