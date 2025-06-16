
import React from 'react';
import type { FsCommand } from './types';
import { getNode } from '@/lib/fileSystem';

export const cat: FsCommand = async (args, { cwd }) => {
  if (args.length === 0) {
    return "cat: missing file operand";
  }
  const path = args[0];
  const node = getNode(path, cwd);

  if (!node) {
    return `cat: ${path}: No such file or directory`;
  }

  if (node.type === 'directory') {
    return `cat: ${path}: Is a directory`;
  }

  if (typeof node.content === 'function') {
    const content = await Promise.resolve(node.content());
    return content;
  }

  return <pre className="whitespace-pre-wrap">{node.content}</pre>;
};
