
import type { Command } from './types';

export const echo: Command = (args: string[]) => args.join(" ");
