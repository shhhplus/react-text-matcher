import { Rule, Payload } from './types';

type MatchedNode = {
  text: string;
  render: Rule['render'];
  payload: Payload;
};

type UnmatchedNode = string;

type Node = MatchedNode | UnmatchedNode;

type Task =
  | {
      done: true;
      node: MatchedNode;
    }
  | {
      done: false;
      node: UnmatchedNode;
    };

type RegRule = Omit<Rule, 'pattern'> & {
  pattern: RegExp;
};

export default function compile(content: string, rules: Rule[]): Node[] {
  if (!content) {
    return [];
  }

  const rules2use: RegRule[] = rules
    .filter((r) => r.pattern)
    .map((r) => {
      if (typeof r.pattern === 'string') {
        return {
          ...r,
          pattern: new RegExp(`${r.pattern}`, 'g'),
        };
      } else {
        return {
          ...r,
          pattern: r.pattern,
        };
      }
    });

  if (rules2use.length === 0) {
    return [content];
  }

  let tasks: Task[] = [{ done: false, node: content }];
  for (const rule of rules2use) {
    let skipable = false;
    tasks = tasks.reduce<Task[]>((acc, cur) => {
      if (cur.done || skipable) {
        return [...acc, cur];
      }
      const result = split(cur.node, rule);
      skipable = result.skipable;
      return [...acc, ...result.tasks];
    }, []);
  }
  const nodes = tasks.map((t) => t.node);
  let index = 0;
  nodes.forEach((node) => {
    if (typeof node !== 'string') {
      node.payload.index = index++;
    }
  });

  return nodes;
}

const split = (
  content: string,
  rule: RegRule,
): {
  tasks: Task[];
  skipable: boolean;
} => {
  const regex = rule.pattern;
  const tasks: Task[] = [];
  let skipable = false;
  let cursor = 0;
  let result = null;
  while ((result = regex.exec(content)) !== null) {
    const value = result[0];
    const index = result.index;
    if (index !== cursor) {
      tasks.push({
        done: false,
        node: content.substring(cursor, index),
      });
    }

    tasks.push({
      done: true,
      node: {
        text: value,
        render: rule.render,
        payload: { index: -1 },
      },
    });
    cursor = index + value.length;

    if (!regex.global) {
      skipable = true;
      break;
    }
  }
  if (cursor < content.length) {
    tasks.push({
      done: false,
      node: content.substring(cursor),
    });
  }
  return { tasks, skipable };
};
