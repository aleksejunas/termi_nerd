
import React from 'react';
import type { FsCommand } from './types';
import { getNode } from '@/lib/fileSystem';

export const grep: FsCommand = async (args, { cwd }) => {
  if (args.length < 2) {
    return "usage: grep PATTERN FILE";
  }
  const pattern = args[0];
  const filePath = args[1];
  
  const node = getNode(filePath, cwd);

  if (!node) {
    return `grep: ${filePath}: No such file or directory`;
  }

  if (node.type === 'directory') {
    return `grep: ${filePath}: Is a directory`;
  }

  let fileContent: string;
  if (typeof node.content === 'function') {
    const result = await Promise.resolve(node.content());
    if (typeof result !== 'string') {
        return `grep: cannot search in ${filePath}`;
    }
    fileContent = result;
  } else {
    fileContent = node.content;
  }
  
  const regex = new RegExp(`(${pattern})`, 'gi');
  const lines = fileContent.split('\n');
  const matchingLines = lines
    .filter(line => line.toLowerCase().includes(pattern.toLowerCase()))
    .map((line, index) => (
      <div key={index}>
        {line.split(regex).map((part, i) => 
          i % 2 === 1 ? <span key={i} className="bg-terminal-yellow text-black">{part}</span> : <span key={i}>{part}</span>
        )}
      </div>
    ));

  if (matchingLines.length === 0) {
    return "";
  }

  return <div className="whitespace-pre-wrap">{matchingLines}</div>;
};
