
import type { Command } from './types';

export const pacman: Command = () => {
    return { command: 'start_pacman', payload: null };
};
