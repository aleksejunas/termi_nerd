
import type { Command } from './commands/types';
import { help } from './commands/help';
import { welcome } from './commands/welcome';
import { about } from './commands/about';
import { projects } from './commands/projects';
import { contact } from './commands/contact';
import { date } from './commands/date';
import { echo } from './commands/echo';
import { clear } from './commands/clear';
import { signup } from './commands/signup';
import { login } from './commands/login';
import { logout } from './commands/logout';
import { whoami } from './commands/whoami';
import { blog } from './commands/blog';
import { post } from './commands/post';
import { theme } from './commands/theme';
import { guestbook } from './commands/guestbook';
import { neofetch } from './commands/neofetch';
import { ls } from './commands/ls';
import { cd } from './commands/cd';
import { cat } from './commands/cat';
import { pwd } from './commands/pwd';
import { tutorial } from './commands/tutorial';
import { grep } from './commands/grep';
import { pacman } from './commands/pacman';
import { vim } from './commands/vim';

export const commands: Record<string, Command> = {
  help,
  welcome,
  about,
  projects,
  contact,
  date,
  echo,
  clear,
  signup,
  login,
  logout,
  whoami,
  blog,
  post,
  theme,
  guestbook,
  neofetch,
  ls,
  cd,
  cat,
  pwd,
  tutorial,
  grep,
  pacman,
  vim,
};
