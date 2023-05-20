import { Rule, Extra } from './types';

type Node =
  | {
      text: string;
      render: Rule['render'];
      extra: Extra;
    }
  | string;

type Task = {
  node: Node;
  done: boolean;
};

export default function compile(content: string, rules: Rule[]): Node[] {
  if (!content) {
    return [];
  }

  const rules2use = rules.filter((m) => m.pattern);

  if (rules2use.length === 0) {
    return [content];
  }

  let tasks: Task[] = [{ node: content, done: false }];
  for (const rule of rules2use) {
    tasks = tasks.reduce<Task[]>((acc, cur) => {
      if (!cur.done && typeof cur.node === 'string') {
        const list = split(cur.node, rule);
        return [...acc, ...list];
      } else {
        return [...acc, cur];
      }
    }, []);
  }
  const nodes = tasks.map((t) => t.node);
  let index = 0;
  nodes.forEach((node) => {
    if (typeof node !== 'string') {
      node.extra.index = index;
      index++;
    }
  });

  return nodes;
}

const split = (content: string, rule: Rule): Task[] => {
  let regex;
  if (typeof rule.pattern === 'string') {
    regex = new RegExp(`${rule.pattern}`, 'g');
  } else {
    regex = rule.pattern;
  }
  const tasks: Task[] = [];
  let cursor = 0;
  let result = null;
  while ((result = regex.exec(content)) !== null) {
    const value = result[0];
    const index = result.index;
    if (index !== cursor) {
      tasks.push({
        node: content.substring(cursor, index),
        done: false,
      });
    }
    tasks.push({
      node: {
        text: value,
        render: rule.render,
        extra: { index: -1 },
      },
      done: true,
    });
    cursor = index + value.length;

    if (!regex.global) {
      break;
    }
  }
  if (cursor < content.length) {
    tasks.push({
      node: content.substring(cursor),
      done: false,
    });
  }
  return tasks;
};
