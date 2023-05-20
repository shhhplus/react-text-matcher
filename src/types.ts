import { ReactNode } from 'react';

export type Payload = {
  index: number;
};

export type Rule = {
  pattern: string | RegExp;
  render: (content: string, payload: Payload) => ReactNode;
};
