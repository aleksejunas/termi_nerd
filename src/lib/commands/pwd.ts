
import type { FsCommand } from './types';

export const pwd: FsCommand = (_args, { cwd }) => {
  return cwd;
};
