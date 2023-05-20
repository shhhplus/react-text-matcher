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
      { text: 'party', render: mockRender, extra: { index: 0 } },
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
      { text: 'party', render: mockRender, extra: { index: 0 } },
      ' time. Welcome to my birthday ',
      { text: 'party', render: mockRender, extra: { index: 1 } },
      '.',
    ]);
  });

  test('matched word at begin should works', () => {
    const content = 'party. Welcome everyone.';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject([
      { text: 'party', render: mockRender, extra: { index: 0 } },
      '. Welcome everyone.',
    ]);
  });

  test('matched word at end should works', () => {
    const content = 'Welcome to my party';
    const mockRender: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: 'party', render: mockRender }]),
    ).toMatchObject([
      'Welcome to my ',
      { text: 'party', render: mockRender, extra: { index: 0 } },
    ]);
  });

  test('single rule with regex should works', () => {
    const content = 'apple_banana_Apple_sun_food';

    const mockRender1: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /apple/, render: mockRender1 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender1, extra: { index: 0 } },
      '_banana_Apple_sun_food',
    ]);

    const mockRender2: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /Apple/, render: mockRender2 }]),
    ).toMatchObject([
      'apple_banana_',
      { text: 'Apple', render: mockRender2, extra: { index: 0 } },
      '_sun_food',
    ]);

    const mockRender3: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /(Apple)|(apple)/g, render: mockRender3 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender3, extra: { index: 0 } },
      '_banana_',
      { text: 'Apple', render: mockRender3, extra: { index: 1 } },
      '_sun_food',
    ]);

    const mockRender4: Rule['render'] = jest.fn();
    expect(
      compile(content, [{ pattern: /apple/gi, render: mockRender4 }]),
    ).toMatchObject([
      { text: 'apple', render: mockRender4, extra: { index: 0 } },
      '_banana_',
      { text: 'Apple', render: mockRender4, extra: { index: 1 } },
      '_sun_food',
    ]);
  });

  test('multiple rules with regex should works', () => {
    const content = 'apple_banana_Apple_sun_food';
    const mockRender1: Rule['render'] = jest.fn();
    const mockRender2: Rule['render'] = jest.fn();

    expect(
      compile(content, [
        { pattern: 'apple', render: mockRender1 },
        { pattern: 'Apple', render: mockRender2 },
      ]),
    ).toMatchObject([
      { text: 'apple', render: mockRender1, extra: { index: 0 } },
      '_banana_',
      { text: 'Apple', render: mockRender2, extra: { index: 1 } },
      '_sun_food',
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
      { text: 'to', render: mockRender, extra: { index: 0 } },
      ' my ',
      { text: 'party', render: mockRender, extra: { index: 1 } },
    ]);

    expect(
      compile(content, [
        { pattern: 'party', render: mockRender },
        { pattern: 'other', render: mockRender },
      ]),
    ).toMatchObject([
      'Welcome to my ',
      { text: 'party', render: mockRender, extra: { index: 0 } },
    ]);
  });
});
