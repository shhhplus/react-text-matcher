import { ReactNode } from 'react';

export type Extra = {
  index: number;
};

export type Rule = {
  pattern: string | RegExp;
  render: (content: string, extra: Extra) => ReactNode;
};
