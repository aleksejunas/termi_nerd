# TermiNerd — Codebase Summary

## Hva er dette?

Et terminal-themed blogg-plattform med retro CLI-estetikk. Brukeren interagerer med hjemmesiden som om det var en Linux-terminal, og kan navigere innhold via kommandoer. Det er en fullverdig blogg bak terminalen.

---

## Tech Stack

| Lag | Teknologi |
|---|---|
| Frontend | React 18 + TypeScript, Vite |
| Routing | React Router 6 |
| Data fetching | TanStack React Query 5 |
| UI-komponenter | shadcn/ui + Radix UI + Tailwind CSS |
| Backend/DB | Supabase (PostgreSQL + Auth + Storage) |
| Markdown | react-markdown + remark-gfm + syntax-highlighter |
| Forms | React Hook Form + Zod |
| Pakkemanager | pnpm |

---

## Prosjektstruktur

```
src/
├── components/         # React-komponenter (Terminal, Header, Admin, UI)
├── pages/              # Sider (Admin, Blog, Auth, Guestbook, Projects...)
├── lib/
│   ├── commands/       # 25+ terminal-kommandoer (ls, cat, vim, blog, etc.)
│   ├── commands.tsx    # Kommando-register
│   └── fileSystem.ts   # Virtuelt filsystem for terminal-navigasjon
├── hooks/              # useTerminal, useIsAdmin, usePacmanGame m.fl.
├── integrations/
│   └── supabase/       # Supabase-klient og auto-genererte typer
└── data/               # Statisk data (prosjekter, bloggposter legacy)
```

---

## Ruter

```
/                   → Terminal (desktop) / MobileHomepage
/login              → Auth-side
/blog               → Blogg-liste
/blog/:slug         → Enkeltpost
/blog/tags/:slug    → Filtrer på tag
/about              → Om-side
/projects           → Portefølje
/projects/:slug     → Prosjekt-detaljer
/contact            → Kontakt
/guestbook          → Gjestebok
/admin              → Admin-dashboard (krever admin-rolle)
/admin/posts/new    → Ny post
/admin/posts/edit/:slug → Rediger post
```

---

## Database (Supabase/PostgreSQL)

| Tabell | Formål |
|---|---|
| `posts` | Bloggposter (title, slug, content, image_url, is_published) |
| `tags` | Tagger (name, slug) |
| `post_tags` | Many-to-many mellom posts og tags |
| `guestbook` | Gjestebok-meldinger |
| `user_roles` | Rolle-basert tilgangskontroll (role: 'admin') |

RLS (Row-Level Security) er aktivert på `posts` og `user_roles`.

Custom DB-funksjoner: `has_role()`, `get_posts_by_tag()`.

---

## Terminal-systemet

Det mest unike med appen. 25+ kommandoer implementert i `src/lib/commands/`:

`ls`, `cd`, `cat`, `pwd`, `echo`, `grep`, `date`, `clear`, `help`,
`whoami`, `neofetch`, `blog`, `post`, `about`, `projects`, `contact`,
`guestbook`, `login`, `logout`, `signup`, `vim`, `pacman`, `theme`, `tutorial`

Kommandoene bruker et virtuelt filsystem (`fileSystem.ts`) for navigasjon uten ekte filer.

---

## Funksjoner som fungerer

- Terminal-grensesnitt med kommandoparsing
- Bruker-autentisering (Supabase email/passord)
- Admin-panel for CRUD på bloggposter
- Bildeopplasting til Supabase Storage
- Publisering/avpublisering av poster
- Søk og tag-filtrering
- Mørk-modus toggle
- Gjestebok
- Pac-Man-spill i terminalen
- Vim-lignende editor i terminalen
- Responsivt mobiloppsett
- Markdown-rendering med syntax-highlighting

---

## Kjente TODOs / uferdige ting

Fra `todos.ts`:

1. **Bedre batch image uploader** — nåværende implementasjon er grunnleggende
2. **Fiks justering av "edit post"-knapp** under bloggposter — layout-bug
3. **Finn bedre database-alternativ** — vurderer alternativ til Supabase
4. **Semantisk HTML og universell utforming (a11y)** — trengs forbedringer

---

## Arkitektur-mønster

- **Command Pattern**: Hvert terminal-kommando er et eget modul med konsistent interface
- **Route Guards**: `AdminRouteGuard` for rolle-basert tilgangskontroll
- **React Query**: Server-state med caching og synkronisering
- **Supabase RLS**: Datasikkerhet direkte i databaselaget
- **Virtuelt filsystem**: In-memory struktur for terminal-navigasjon

---

## Kjøre lokalt

```bash
pnpm install
pnpm dev          # starter på port 8080
```

Krever `.env` med Supabase-nøkler (se `.env.example` eller `supabase/config.toml.example`).

---

## Git-status (ved oppsummering)

Gren: `refactor/the-plan`

Ucommittede endringer:
- `README.md` og `pnpm-workspace.yaml` oppdatert
- Supabase-klient og migrasjoner modifisert
- `PROJECT_DOCUMENTATION.md` flyttet til `docs/`
- `todos.ts` oppdatert
