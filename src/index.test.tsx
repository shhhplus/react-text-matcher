import { render } from '@testing-library/react';
import TextMatcher, { TMResult } from './index';
import { Fragment } from 'react';

const createFn = () => {
  return jest.fn((result: TMResult) => {
    return (
      <>
        {result.map((node, idx) => {
          return (
            <Fragment key={idx}>
              {typeof node === 'string' ? node : <span>{node.text}</span>}
            </Fragment>
          );
        })}
      </>
    );
  });
};

describe('TextMatcher', () => {
  test(`component could be updated and unmounted without errors`, () => {
    const text = 'Welcome to my birthday party.';
    const fn1 = createFn();

    const { unmount, rerender } = render(
      <TextMatcher rules={['birthday']} text={text}>
        {fn1}
      </TextMatcher>,
    );
    expect(() => {
      const fn2 = createFn();
      rerender(
        <TextMatcher rules={['party']} text={text}>
          {fn2}
        </TextMatcher>,
      );
      unmount();
    }).not.toThrow();
  });

  test(`single matched should works`, () => {
    const text = 'Welcome to my birthday party.';
    const rules = ['birthday'];
    const fn = createFn();
    const { container } = render(
      <TextMatcher rules={rules} text={text}>
        {fn}
      </TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `Welcome to my <span>birthday</span> party.`,
    );
  });

  test(`multiple matched with single rule should works`, () => {
    const text = 'hi, party time. Welcome to my birthday party.';
    const rules = ['party'];
    const fn = createFn();
    const { container } = render(
      <TextMatcher rules={rules} text={text}>
        {fn}
      </TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `hi, <span>party</span> time. Welcome to my birthday <span>party</span>.`,
    );
  });

  test(`multiple matched with multiple rule should works`, () => {
    const text = 'AppleTodayFoodAppleSunAppleFoodapple';
    const rules = [new RegExp('food', 'gi'), new RegExp('Apple')];
    const fn = createFn();
    const { container } = render(
      <TextMatcher rules={rules} text={text}>
        {fn}
      </TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `<span>Apple</span>Today<span>Food</span>AppleSunApple<span>Food</span>apple`,
    );
  });

  test('empty words should works', () => {
    const text = 'Welcome to my birthday party.';
    const rules = [''];
    const fn = createFn();
    const { container } = render(
      <TextMatcher rules={rules} text={text}>
        {fn}
      </TextMatcher>,
    );

    expect(container.innerHTML).toEqual(text);
  });

  test(`component should update when props changes`, () => {
    const rules1 = ['nothing'];
    const fn1 = createFn();
    const { container, rerender } = render(
      <TextMatcher rules={rules1} text="hello, everyone.">
        {fn1}
      </TextMatcher>,
    );

    const rules2 = ['birthday'];
    const fn2 = createFn();
    rerender(
      <TextMatcher rules={rules2} text="Welcome to my birthday party.">
        {fn2}
      </TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `Welcome to my <span>birthday</span> party.`,
    );
  });
});
