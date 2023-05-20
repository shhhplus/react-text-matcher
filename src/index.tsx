import { FC, Fragment, useMemo } from 'react';
import { Rule } from './types';
import compile from './compile';

type TextMatcherProps = {
  rules: Rule[];
  children: string;
};

const TextMatcher: FC<TextMatcherProps> = ({ rules, children }) => {
  const nodes = useMemo(() => compile(children, rules), [children, rules]);

  return (
    <Fragment>
      {nodes.map((node, idx) => {
        return (
          <Fragment key={idx}>
            {typeof node === 'string'
              ? node
              : node.render(node.text, node.extra)}
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default TextMatcher;
