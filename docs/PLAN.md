# PLAN.md — TermiNerd

Prioritert oversikt over hva som bør gjøres, basert på kjente issues og kodegjennomgang.

---

## Høy prioritet

### Refaktorér `useTerminal.tsx`
Hooken er 500 linjer og eier for mye — auth-state, game-state, vim-state, tutorial, tab-completion og kommandoparsing lever alle her.
Forslag til oppdeling:
- `useTerminalState` — linjer, input, historikk
- `useTerminalAuth` — session, passord-prompt-flyt
- `useTabCompletion` — tab-completion logikk
- `useTerminalModes` — game/vim/tutorial state

### Legg til filtype- og størrelsesvalidering på bildeopplasting
`ImageUploader.tsx` stoler på `accept="image/*"` i `<input>`, som kun er en browser-hint. Legg til validering av MIME-type og maks filstørrelse (`file.type`, `file.size`) før upload til Supabase Storage.

### Semantisk HTML og tilgjengelighet (a11y)
- Erstatt generiske `<div>`-containere med `<main>`, `<nav>`, `<article>`, `<section>` der det passer
- Alle bilder trenger meningsfull `alt`-tekst (ikke bare `"Image description"`)
- Tastaturnavigasjon i terminalen bør testes

---

## Medium prioritet

### Gjør prosjektdata redigerbart uten kodeendring
Prosjektene i `src/data/projects.ts` er hardkodet. Flytt dem til Supabase (ny tabell `projects`) slik at de kan redigeres fra admin-panelet — samme mønster som `posts`.

### Fiks alignment på "edit post"-knapp
Kjent bug fra `todos.ts`. Edit-knappen under bloggposter er feilplassert.

### Kortere cache-tid for admin-rollesjekk
`useIsAdmin` cacher resultatet i 5 minutter (`staleTime`). Hvis en admin-rolle fjernes, har brukeren fortsatt tilgang i nettleseren. Vurder å redusere til 60 sekunder, eller invalider cachen ved logout.

### Stram inn TypeScript-konfigurasjonen
`noImplicitAny` er satt til `false`. Aktiver det og rydd opp i typene — spesielt `Command`-typen (`(...args: unknown[])`) og `any`-castene i `useTerminal`.

---

## Nye features

### RSS-feed
Klassisk blogg-must som mangler helt. Kan implementeres som en statisk `/rss.xml`-rute (generert med `vite-plugin-rss` eller en enkel Supabase Edge Function). Viktig for lesere som bruker feedlesere.

### Lesetid på innlegg
Beregn estimert lesetid fra `content.split(' ').length / 200` (ord per minutt). Vises på postkortene i `BlogIndexPage` og øverst i `PostPage`. Én linje logikk, stor UX-gevinst.

### Kopieringsknapp på kodeblokker
`PostPage.tsx` rendrer kodeblokker manuelt i `ReactMarkdown`-komponentene, men uten "Copy"-knapp. For en tech-blogg er dette et standard forventning. Legg til en wrapper rundt `<pre>`-taggen med en `navigator.clipboard`-knapp.

### Dynamiske OG/meta-tags
Hvert blogginnlegg bruker sannsynligvis samme `<title>` og ingen `og:image`. Legg til `react-helmet-async` eller Vite SSG-støtte for per-side metadata — viktig for deling på sosiale medier og SEO.

### Innholdsfortegnelse (ToC) på lange innlegg
Parse overskriftene fra markdown (regex eller `rehype-slug`) og generer en sticky sidemeny i `PostPage`. Spesielt nyttig for lengre tekniske artikler.

### Paginering på blogglisten
`BlogIndexPage` laster alle publiserte poster i én query. Legg til offset-basert paginering (eller "load more") i Supabase-queryen med `.range(from, to)`.

### Forhåndsvisning av utkast for admin
Det finnes ingen `/admin/posts/preview/:slug`-rute. Admin må publisere for å se sluttresultatet. En preview-rute som viser upublisert innhold (med admin-guard) ville vært nyttig.

---

## Terminalen — thematiske features

### `man`-kommando
`man ls`, `man post` etc. — viser mer detaljert hjelp for enkeltkommandoer. Hver kommando kan eksportere en `manPage`-streng i tillegg til selve kommandofunksjonen. Veldig on-brand.

### `history`-kommando
Pilnavigasjon eksisterer allerede, men en `history`-kommando som lister de siste 50 kommandoene (fra den eksisterende `history`-arrayen i `useTerminal`) er én linje å implementere.

### `alias`-kommando
Brukere kan definere egne forkortelser: `alias ll="ls -la"`, lagret i `localStorage`. Passer perfekt til terminaltemaet og er relativt enkel å implementere som et lag over kommandodispatch.

### `sudo`-easter egg
`sudo rm -rf /` → "Nice try.", `sudo make me a sandwich` → "Okay." Koster ingenting å legge til og passer prosjektets tone.

---

## Teknisk opprydding

### Fjern `console.log` i `PostPage.tsx`
`PostPage.tsx:179` og `:185` har debug-logging som ble igjen fra utvikling:
```ts
console.log('Rendering image:', props);
console.log('Post content:', post.content);
```

### Dedupliser admin-sjekk i `PostPage`
`PostPage.tsx` har sin egen `checkAdmin`-`useEffect` som kaller `supabase.rpc('has_role')` direkte. Bruk `useIsAdmin`-hooken i stedet — da slipper du duplikat logikk og får caching gratis.

### Prosjektdata er placeholder
`src/data/projects.ts` inneholder `"Project Alpha"`, `"Project Beta"`, `"Project Gamma"` med `liveUrl: '#'`. Dette er åpenbart ikke ekte innhold — enten fyll inn faktiske prosjekter eller implementer Supabase-tabellen (se "Gjør prosjektdata redigerbart" over).

---

## Lav prioritet / fremtid

### Erstatt aritets-tricket i kommandodispatch
Systemet bruker `cmd.length` (antall parametre) for å skille `FsCommand` fra `RegularCommand`. Dette er en implisitt kontrakt. Alternativ: merk kommandoer eksplisitt med en `type`-property, eller bruk to separate registre.

### Vurder database-alternativ
Fra `todos.ts`: Supabase fungerer, men er priset per prosjekt og har vendor lock-in. Alternativer å utforske: PocketBase (selvhostet), Turso (SQLite edge), Neon (Postgres serverless).

### Rate limiting på gjestebok
Gjesteboken krever ingen autentisering — åpen for spam. Vurder enkel klientside-throttling eller Supabase Edge Functions for rate limiting.

### Batch-bildeopplaster
Fra `todos.ts`: Nåværende opplaster håndterer én fil om gangen. Legg til støtte for å velge og laste opp flere bilder samtidig.

---

## Docs-struktur

```
docs/
├── PLAN.md                        ← dette dokumentet
├── SUMMARY.md                     ← prosjektoversikt
├── PROJECT_DOCUMENTATION.md       ← teknisk dokumentasjon
└── migrating-to-new-database.md   ← migrasjonsguide
```
