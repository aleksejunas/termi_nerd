import { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light" | "system";
type TerminalTheme = "tokyonight" | "dracula" | "gruvbox";

const terminalThemes = {
  tokyonight: {
    "--terminal-bg": "#1a1b26",
    "--terminal-fg": "#a9b1d6",
    "--terminal-green": "#9ece6a",
    "--terminal-yellow": "#e0af68",
    "--terminal-blue": "#7aa2f7",
    "--terminal-magenta": "#bb9af7",
    "--terminal-cyan": "#7dcfff",
  },
  dracula: {
    "--terminal-bg": "#282a36",
    "--terminal-fg": "#f8f8f2",
    "--terminal-green": "#50fa7b",
    "--terminal-yellow": "#f1fa8c",
    "--terminal-blue": "#bd93f9",
    "--terminal-magenta": "#ff79c6",
    "--terminal-cyan": "#8be9fd",
  },
  gruvbox: {
    "--terminal-bg": "#282828",
    "--terminal-fg": "#ebdbb2",
    "--terminal-green": "#b8bb26",
    "--terminal-yellow": "#fabd2f",
    "--terminal-blue": "#83a598",
    "--terminal-magenta": "#d3869b",
    "--terminal-cyan": "#8ec07c",
  },
};

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  terminalTheme: TerminalTheme;
  setTerminalTheme: (theme: TerminalTheme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  terminalTheme: "tokyonight",
  setTerminalTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );
  const [terminalTheme, setTerminalTheme] = useState<TerminalTheme>(
    () =>
      (localStorage.getItem("terminal-theme") as TerminalTheme) || "tokyonight",
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const themeColors = terminalThemes[terminalTheme];
    const root = window.document.documentElement;
    for (const [key, value] of Object.entries(themeColors)) {
      root.style.setProperty(key, value);
    }
  }, [terminalTheme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
    terminalTheme,
    setTerminalTheme: (theme: TerminalTheme) => {
      localStorage.setItem("terminal-theme", theme);
      setTerminalTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// FIX: Fast refresh bug
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
