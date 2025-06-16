
import React from 'react';
import type { FsCommand } from './types';
import { getNode } from '@/lib/fileSystem';

export const ls: FsCommand = (args, { cwd }) => {
  const path = args[0] || '.';
  const node = getNode(path, cwd);

  if (!node) {
    return `ls: cannot access '${path}': No such file or directory`;
  }

  if (node.type === 'file') {
    return path.split('/').pop() || '';
  }

  const children = Object.keys(node.children);
  if (children.length === 0) {
    return '';
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {children.map(name => {
        const childNode = node.children[name];
        const color = childNode.type === 'directory' ? 'text-terminal-blue' : 'text-terminal-fg';
        return <span key={name} className={color}>{name}</span>;
      })}
    </div>
  );
};
