import { DEFAULT_AVATAR, DEFAULT_PRODUCT, safeImage } from './image.util';

describe('safeImage', () => {
  it('returns fallback for null/undefined/empty/whitespace', () => {
    expect(safeImage(null)).toBe(DEFAULT_AVATAR);
    expect(safeImage(undefined)).toBe(DEFAULT_AVATAR);
    expect(safeImage('')).toBe(DEFAULT_AVATAR);
    expect(safeImage('   ')).toBe(DEFAULT_AVATAR);
  });

  it('returns the url when provided', () => {
    expect(safeImage('https://cdn.example/a.png')).toBe('https://cdn.example/a.png');
  });

  it('accepts a custom fallback', () => {
    expect(safeImage('', DEFAULT_PRODUCT)).toBe(DEFAULT_PRODUCT);
  });
});
