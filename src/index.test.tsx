import { render } from '@testing-library/react';
import { Rule } from './types';
import TextMatcher from './index';

describe('TextMatcher', () => {
  test(`component could be updated and unmounted without errors`, () => {
    const text = 'Welcome to my birthday party.';
    const rules1: Rule[] = [
      {
        pattern: 'birthday',
        render: (content) => {
          return <span style={{ color: 'greenyellow' }}>{content}</span>;
        },
      },
    ];
    const { unmount, rerender } = render(
      <TextMatcher rules={rules1}>{text}</TextMatcher>,
    );
    expect(() => {
      const rules2: Rule[] = [
        {
          pattern: 'party',
          render: (content) => {
            return <span style={{ color: 'red' }}>{content}</span>;
          },
        },
      ];
      rerender(<TextMatcher rules={rules2}>{text}</TextMatcher>);
      unmount();
    }).not.toThrow();
  });

  test(`single matched should works`, () => {
    const text = 'Welcome to my birthday party.';
    const rules: Rule[] = [
      {
        pattern: 'birthday',
        render: (content) => {
          return <span style={{ color: 'red' }}>{content}</span>;
        },
      },
    ];
    const { container } = render(
      <TextMatcher rules={rules}>{text}</TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `Welcome to my <span style="color: red;">birthday</span> party.`,
    );
  });

  test(`multiple matched with single rule should works`, () => {
    const text = 'hi, party time. Welcome to my birthday party.';
    const rules: Rule[] = [
      {
        pattern: 'party',
        render: (content) => {
          return <span style={{ color: 'red' }}>{content}</span>;
        },
      },
    ];
    const { container } = render(
      <TextMatcher rules={rules}>{text}</TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `hi, <span style="color: red;">party</span> time. Welcome to my birthday <span style="color: red;">party</span>.`,
    );
  });

  test(`multiple matched with multiple rule should works`, () => {
    const text = 'AppleTodayFoodAppleHappySunFood';
    const rules: Rule[] = [
      {
        pattern: new RegExp('food', 'gi'),
        render: (content, extra) => {
          return (
            <span style={{ color: 'green' }}>
              {extra.index}
              {content}
            </span>
          );
        },
      },
      {
        pattern: 'Apple',
        render: (content, extra) => {
          return (
            <span style={{ color: 'red' }}>
              {extra.index}
              {content}
            </span>
          );
        },
      },
    ];
    const { container } = render(
      <TextMatcher rules={rules}>{text}</TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `<span style="color: red;">0Apple</span>Today<span style="color: green;">1Food</span><span style="color: red;">2Apple</span>HappySun<span style="color: green;">3Food</span>`,
    );
  });

  test('empty words should works', () => {
    const text = 'Welcome to my birthday party.';
    const rules: Rule[] = [
      {
        pattern: '',
        render: (content) => {
          return <span style={{ color: 'red' }}>{content}</span>;
        },
      },
    ];
    const { container } = render(
      <TextMatcher rules={rules}>{text}</TextMatcher>,
    );

    expect(container.innerHTML).toEqual(text);
  });

  test(`component should update when props changes`, () => {
    const rules1: Rule[] = [
      {
        pattern: 'nothing',
        render: (content) => {
          return <span style={{ color: 'green' }}>{content}</span>;
        },
      },
    ];
    const { container, rerender } = render(
      <TextMatcher rules={rules1}>hello, everyone.</TextMatcher>,
    );

    const rules2: Rule[] = [
      {
        pattern: 'birthday',
        render: (content) => {
          return <span style={{ color: 'red' }}>{content}</span>;
        },
      },
    ];
    rerender(
      <TextMatcher rules={rules2}>Welcome to my birthday party.</TextMatcher>,
    );

    expect(container.innerHTML).toEqual(
      `Welcome to my <span style="color: red;">birthday</span> party.`,
    );
  });
});
