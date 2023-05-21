import { FC, ReactNode, useMemo } from 'react';
import createTextMatcher from '@shhhplus/text-matcher';

type TParameters = Parameters<typeof createTextMatcher>;
type TextMatcher = ReturnType<typeof createTextMatcher>;
export type TMResult = ReturnType<TextMatcher['exec']>;

type TextMatcherProps = {
  text: string;
  rules: TParameters[0];
  children: (result: TMResult) => ReactNode;
};

const TextMatcher: FC<TextMatcherProps> = ({ text, rules, children }) => {
  const result = useMemo(() => {
    return createTextMatcher(rules).exec(text);
  }, [rules, text]);
  return <>{children(result)}</>;
};

export default TextMatcher;
