
import React from 'react';
import type { FsCommand, CommandOutput } from './types';
import { getNode } from '@/lib/fileSystem';

export const vim: FsCommand = async (args, { cwd }) => {
  if (args.length === 0) {
    return "vim: File name must be specified";
  }
  const path = args[0];
  const node = getNode(path, cwd);

  if (!node) {
    return `vim: Cannot find file "${path}"`;
  }

  if (node.type === 'directory') {
    return `vim: "${path}" is a directory`;
  }

  let fileContent: CommandOutput;
  if (typeof node.content === 'function') {
    fileContent = await Promise.resolve(node.content());
  } else {
    fileContent = node.content;
  }

  if (React.isValidElement(fileContent) || (typeof fileContent === 'object' && fileContent !== null && 'command' in fileContent)) {
      return `vim: Cannot open "${path}". File does not contain plain text.`;
  }

  return {
    command: 'start_vim',
    payload: {
      filename: path,
      content: String(fileContent)
    }
  };
};
