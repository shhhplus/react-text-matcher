# react-text-matcher

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/shhhplus/react-text-matcher/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@shhhplus/react-text-matcher.svg?style=flat)](https://www.npmjs.com/package/@shhhplus/react-text-matcher) [![codecov](https://img.shields.io/codecov/c/github/shhhplus/react-text-matcher/main?token=C8C11XH4DN)](https://codecov.io/gh/shhhplus/react-text-matcher) [![build status](https://img.shields.io/github/actions/workflow/status/shhhplus/react-text-matcher/cd.yml)](https://github.com/shhhplus/react-text-matcher/actions)

A React component that supports regular expression matching and customized rendering.

## Install

```sh
npm install @shhhplus/react-text-matcher --save
```

## Usage

### Basic

```jsx
import { useMemo } from 'react';
import TextMatcher from '@shhhplus/react-text-matcher';

const Demo1 = () => {
  const rules = useMemo(() => {
    return [
      {
        pattern: 'everyone',
        render: (content, extra) => {
          return (
            <span style={{ color: 'green' }}>
              {extra.index}.{content}
            </span>
          );
        },
      },
      {
        pattern: 'birthday',
        render: (content, extra) => {
          return (
            <span style={{ color: 'red' }}>
              {extra.index}.{content}
            </span>
          );
        },
      },
    ];
  }, []);

  return (
    <TextMatcher rules={rules}>
      Welcome everyone to come and join my birthday party.
    </TextMatcher>
  );
};
```

### RegExp

```jsx
import { useMemo } from 'react';
import TextMatcher from '@shhhplus/react-text-matcher';

const Demo1 = () => {
  const rules = useMemo(() => {
    return [
      {
        pattern: new RegExp('food', 'gi'),
        render: (content, extra) => {
          return (
            <span style={{ color: 'green' }}>
              {extra.index}.{content}
            </span>
          );
        },
      },
      {
        pattern: 'Apple',
        render: (content, extra) => {
          return (
            <span style={{ color: 'red' }}>
              {extra.index}.{content}
            </span>
          );
        },
      },
    ];
  }, []);

  return (
    <TextMatcher rules={rules}>AppleTodayFoodAppleHappySunFood</TextMatcher>
  );
};
```
