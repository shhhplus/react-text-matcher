import compile from './compile';
import { Rule } from './types';

describe('compile', () => {
  test('empty content should works', () => {
    const mockRender: Rule['render'] = jest.fn();
    expect(compile('', [{ pattern: '', render: mockRender }])).toMatchObject(
      [],
    );
  });

  test('empty rules should works', () => {
    const content = 'Welcome to my party';
    expect(compile(content, [])).toMatchObject([content]);
  });

  test('empty content and empty rules should works', () => {
    expect(compile('', [])).toMatchObject([]);
  });

  test('no matched word should works', () => {
    const content = 'Welcome to my birthday party.';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'tom', render: mockRender }]),
    ).toMatchObject([content]);
  });

  test('a single matched word should works', () => {
    const content = 'Welcome to my birthday party.';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject([
      'Welcome to my birthday ',
      { text: 'party', render: mockRender },
      '.',
    ]);
  });

  test(`multiple matched words should works`, () => {
    const content = 'hi, party time. Welcome to my birthday party.';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject([
      'hi, ',
      { text: 'party', render: mockRender },
      ' time. Welcome to my birthday ',
      { text: 'party', render: mockRender },
      '.',
    ]);
  });

  test('matched word at begin should works', () => {
    const content = 'party. Welcome everyone.';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject([
      { text: 'party', render: mockRender },
      '. Welcome everyone.',
    ]);
  });

  test('matched word at end should works', () => {
    const content = 'Welcome to my party';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject(['Welcome to my ', { text: 'party', render: mockRender }]);
  });

  test('single rule with regex should works', () => {
    const content = 'apple_banana_Apple_sun_food';

    const mockRender1: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /apple/, render: mockRender1 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender1 },
      '_banana_Apple_sun_food',
    ]);

    const mockRender2: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /Apple/, render: mockRender2 }]),
    ).toMatchObject([
      'apple_banana_',
      { text: 'Apple', render: mockRender2 },
      '_sun_food',
    ]);

    const mockRender3: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /(Apple)|(apple)/g, render: mockRender3 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender3 },
      '_banana_',
      { text: 'Apple', render: mockRender3 },
      '_sun_food',
    ]);

    const mockRender4: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /apple/gi, render: mockRender4 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender4 },
      '_banana_',
      { text: 'Apple', render: mockRender4 },
      '_sun_food',
    ]);
  });

  test('multiple rules with regex should works', () => {
    const content = 'apple_sun_banana_Apple_sun_food_sun';
    const mockRender1: Rule['render'] = jest.fn();
    const mockRender2: Rule['render'] = jest.fn();

    expect(
      compile(content, [
        { pattern: new RegExp('apple', 'gi'), render: mockRender1 },
        { pattern: new RegExp('sun'), render: mockRender2 },
      ]),
    ).toMatchObject([
      { text: 'apple', render: mockRender1 },
      '_',
      { text: 'sun', render: mockRender2 },
      '_banana_',
      { text: 'Apple', render: mockRender1 },
      '_sun_food_sun',
    ]);
  });

  test('multiple rules as props should works', () => {
    const content = 'Welcome to my party';
    const mockRender: Rule['render'] = jest.fn();

    expect(
      compile(content, [
        { pattern: 'party', render: mockRender },
        { pattern: 'to', render: mockRender },
      ]),
    ).toMatchObject([
      'Welcome ',
      { text: 'to', render: mockRender },
      ' my ',
      { text: 'party', render: mockRender },
    ]);

    expect(
      compile(content, [
        { pattern: 'party', render: mockRender },
        { pattern: 'other', render: mockRender },
      ]),
    ).toMatchObject(['Welcome to my ', { text: 'party', render: mockRender }]);
  });

  test('payload should works', () => {
    const content = 'apple_sun_banana_Apple_sun_food_sun';
    const mockRender1: Rule['render'] = jest.fn();
    const mockRender2: Rule['render'] = jest.fn();

    expect(
      compile(content, [
        { pattern: new RegExp('apple', 'gi'), render: mockRender1 },
        { pattern: new RegExp('sun'), render: mockRender2 },
      ]),
    ).toMatchObject([
      {
        text: 'apple',
        render: mockRender1,
        payload: { index: 0 },
      },
      '_',
      {
        text: 'sun',
        render: mockRender2,
        payload: { index: 1 },
      },
      '_banana_',
      {
        text: 'Apple',
        render: mockRender1,
        payload: { index: 2 },
      },
      '_sun_food_sun',
    ]);
  });
});
