# react-text-matcher

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/shhhplus/react-text-matcher/blob/master/LICENSE) [![npm version](https://img.shields.io/npm/v/@shhhplus/react-text-matcher.svg?style=flat)](https://www.npmjs.com/package/@shhhplus/react-text-matcher) [![codecov](https://img.shields.io/codecov/c/github/shhhplus/react-text-matcher/main?token=C8C11XH4DN)](https://codecov.io/gh/shhhplus/react-text-matcher) [![build status](https://img.shields.io/github/actions/workflow/status/shhhplus/react-text-matcher/cd.yml)](https://github.com/shhhplus/react-text-matcher/actions)

A React component that matches text using specified rules, supporting string and regular expressions.
Developed based on [text-matcher](https://www.npmjs.com/package/@shhhplus/text-matcher).
If you just want text highlighting, recommend using [react-highlight-words](https://www.npmjs.com/package/@shhhplus/react-highlight-words), because it provides a simpler API.

## Install

```sh
npm install @shhhplus/react-text-matcher --save
```

## Usage

### Basic

```jsx
import TextMatcher from '@shhhplus/react-text-matcher';

const Demo = () => {
  return (
    <TextMatcher
      rules={['everyone', 'birthday']}
      text="Welcome everyone to come and join my birthday party."
    >
      {(nodes) => {
        return (
          <>
            {nodes.map((node, idx) => {
              return (
                <Fragment key={idx}>
                  {typeof node === 'string' ? node : <span>{node.text}</span>}
                </Fragment>
              );
            })}
          </>
        );
      }}
    </TextMatcher>
  );
};
```

### RegExp

```jsx
import TextMatcher from '@shhhplus/react-text-matcher';

const Demo = () => {
  return (
    <TextMatcher
      rules={[new RegExp('food', 'gi'), 'Apple']}
      text="AppleTodayFoodAppleHappySunFood"
    >
      {(nodes) => {
        return (
          <>
            {nodes.map((node, idx) => {
              return (
                <Fragment key={idx}>
                  {typeof node === 'string' ? node : <span>{node.text}</span>}
                </Fragment>
              );
            })}
          </>
        );
      }}
    </TextMatcher>
  );
};
```
