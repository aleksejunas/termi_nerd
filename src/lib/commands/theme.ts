// src/lib/commands/theme.ts
// Themes for the terminal

import type { Command } from "./types";

const availableThemes = ["tokyonight", "dracula", "gruvbox"];

export const theme: Command = async (args) => {
  const themeName = args[0];

  if (!themeName) {
    return `Usage: theme <theme_name>\nAvailable themes: ${availableThemes.join(", ")}`;
  }

  if (availableThemes.includes(themeName)) {
    return { command: "set_theme", payload: themeName };
  }

  return `Theme '${themeName}' not found. Available themes: ${availableThemes.join(", ")}`;
};
