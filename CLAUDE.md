# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # dev server at http://localhost:8080
pnpm build        # production build → dist/
pnpm build:dev    # dev-mode build
pnpm lint         # ESLint
pnpm preview      # preview production build
```

There are no tests in this project.

Env file required: `.env.development` (or `.env`) with:
```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Commit messages

When asked to write a commit message, output it in this format for copy-pasting into lazygit:

```
Short summary in imperative mood (max 72 chars)

- Detail about what changed and why
- Another detail if relevant
- Keep each bullet to one line
```

No triple backticks around the message itself — just the raw text, ready to paste.

## Architecture

**SPA** built with React + Vite. Path alias `@/` resolves to `src/`.

### Two distinct UIs

The home route (`/`) renders either `Terminal` (desktop) or `MobileHomepage` — a detection hook switches between them. Every other route renders inside `BlogLayout` (standard header/nav wrapper with a React Router `<Outlet>`).

### Terminal system

The terminal is the central feature. Its state lives entirely in `useTerminal` (`src/hooks/useTerminal.tsx`), which handles:
- Command parsing and dispatch
- Auth state (Supabase session, password prompt flow)
- Virtual filesystem `cwd` (current working directory)
- In-terminal modes: post editing (`PostEditor`), Pac-Man game, Vim editor

Commands are registered in `src/lib/commands.tsx` as a `Record<string, Command>`. Each command lives in `src/lib/commands/<name>.ts(x)` and must match the `Command` type from `src/lib/commands/types.ts`.

**Command return values drive behaviour in `useTerminal`:** returning a plain string/JSX renders output; returning a special object `{ command: string, payload: unknown }` triggers side effects (e.g. `edit_post`, `set_theme`, `start_pacman`, `start_vim`, `prompt_password`). The `clear_screen` string literal is also special-cased.

**Command arity distinguishes types at runtime:** commands taking 2 args `(args, context)` are filesystem commands (`FsCommand`); those taking 1 arg are regular (`RegularCommand`). Don't change a command's arity without updating the dispatch logic in `useTerminal`.

### Virtual filesystem

`src/lib/fileSystem.ts` defines an in-memory tree (`VDirectory`/`VFile`). File contents can be static strings or functions returning `CommandResult` (lazily evaluated when `cat` is run). Tab completion for `cd`, `ls`, `cat`, `vim` walks this tree live.

### Supabase integration

Single client instance exported from `src/integrations/supabase/client.ts`. Types are auto-generated in `src/integrations/supabase/types.ts` — don't edit that file manually.

Database tables: `posts`, `tags`, `post_tags`, `guestbook`, `user_roles`. RLS is enabled on `posts` and `user_roles`. Admin access is gated by the `user_roles` table; `useIsAdmin` (`src/hooks/useIsAdmin.ts`) queries it and `AdminRouteGuard` wraps protected routes.

### Data fetching

React Query is used for all Supabase reads in pages/components. The `QueryClient` is instantiated once in `App.tsx`.

### Adding a new terminal command

1. Create `src/lib/commands/<name>.ts(x)` exporting a function matching `Command` (or `FsCommand` if it needs `cwd`).
2. Register it in `src/lib/commands.tsx`.
3. If it needs subcommand tab-completion, add it to the `subCommands` map in `useTerminal`'s `handleTabCompletion`.

### Adding a new page/route

Add the route in `App.tsx`. Non-terminal pages should be nested inside the `<BlogLayout>` route so they get the standard header.
