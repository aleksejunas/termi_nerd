
import type { FsCommand } from './types';
import { getNode, resolvePath } from '@/lib/fileSystem';

export const cd: FsCommand = (args, { cwd, setCwd }) => {
  const path = args[0] || '/';
  const node = getNode(path, cwd);

  if (!node) {
    return `cd: no such file or directory: ${path}`;
  }
  
  if (node.type !== 'directory') {
    return `cd: not a directory: ${path}`;
  }
  
  setCwd(resolvePath(path, cwd));
  return "";
};
