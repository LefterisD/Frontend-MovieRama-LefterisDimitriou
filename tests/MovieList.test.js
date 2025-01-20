import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';  // This should be correct

Object.assign(global, { TextDecoder, TextEncoder });

const html = fs.readFileSync(path.resolve(__dirname, '../index.html'), 'utf8');

describe('MovieList', () => {
    let dom;
    let document;

    beforeEach(() => {
        // Set up a new JSDOM instance
        dom = new JSDOM(html);
        document = dom.window.document;
    
      });

    it('renders a title', () => {
        expect(document.querySelector('.header__container__title')).toBeInTheDocument();
    });
})