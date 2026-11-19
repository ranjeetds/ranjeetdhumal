# AGENTS.md

Guidance for AI agents and contributors working in this repository. `README.md` explains the
architecture; this file states the rules and the recipes.

## What this is

ranjeetdhumal.com: a static, dark-first personal site for AI research and interactive
learning. Astro 7, React 19 islands, TypeScript (strict), Tailwind CSS 4, MDX content
collections, deployed to Cloudflare Workers static assets.

## Commands

Use Node 24 (`nvm use`; Astro 7 fails on Node older than 22.23.4) and npm.

```sh
npm run dev       # dev server
npm run check     # type-check; must report 0 errors, 0 warnings, 0 hints
npm run build     # static build into dist/
npm run og        # regenerate public/og.png
```

**Before calling work done, run `npm run check` and `npm run build`.** Both must pass. The
build's "No files found matching…" warnings for empty content collections are expected.

In a sandbox that blocks writes outside the workspace, both CLIs fail trying to write to
the home directory. Set `ASTRO_TELEMETRY_DISABLED=1` for Astro commands, and
`WRANGLER_LOG_PATH="$PWD/.wrangler/logs" XDG_CONFIG_HOME="$PWD/.wrangler/config"` for
`wrangler deploy --dry-run` (`.wrangler/` is git-ignored).

## Rules

1. **Stay static.** `output: 'static'`. No SSR adapter, no API routes, no runtime data
   fetching.
2. **No JavaScript by default.** Write `.astro` components. Use a React island only for a
   genuinely interactive figure, and hydrate it with `client:visible`. Never `client:load`
   a layout or navigation component.
3. **Semantic colour tokens only.** Use `bg-canvas`, `bg-surface`, `bg-raised`,
   `border-line`, `border-line-strong`, `text-ink`, `text-ink-muted`, `text-ink-faint`,
   `text-accent`, `text-accent-ink`, `text-signal`. Tailwind's default palette is removed
   on purpose. No hex values or arbitrary colours in components. Tokens switch with the
   theme, so a `dark:` variant is rarely correct.
4. **Design tokens live in `src/styles/global.css`.** There is no `tailwind.config.js`; do
   not create one. Add or change tokens there, in both the `:root` (light) and `.dark`
   blocks, and keep text contrast at WCAG AA or better in both.
5. **Site structure lives in `src/config/site.ts`.** Navigation, section titles and
   descriptions are read from it by the header, mobile menu, footer, homepage and
   `PageLayout`. Never hard-code a nav link or repeat a section description in a page.
6. **CSS animation first.** Use the `rise` and `reveal` utilities. Motion is allowed only
   inside figure islands. Everything must respect `prefers-reduced-motion`.
7. **Accessibility is not optional.** One `<h1>` per page, no skipped heading levels,
   semantic landmarks, visible focus, labelled controls, and a keyboard equivalent for
   every pointer interaction.
8. **Do not invent facts about the author.** Biography, employment, publications, social
   links and contact details must come from a source the author supplied (the résumé, LinkedIn,
   GitHub). Do not add roles, dates, clients or credentials beyond those sources, and do not
   publish the home address or phone number.
9. **Do not add dependencies casually.** Each one needs a concrete, present use. D3 and
   Three.js are intentionally not installed until the first figure that needs them.
10. **No filler content.** Do not generate placeholder articles. Empty collections render an
    `EmptyState`.

## Conventions

- **Imports.** Use the `@/` alias for `src/` (`import { site } from '@/config/site'`).
- **Components.** `PascalCase.astro` or `.tsx`. Props are typed with an `interface Props`.
  A reusable component opens with a short comment saying what it is for and any constraint
  a caller should know. Add a `class` prop only where callers need to adjust placement
  (as `Section`, `Icon` and `VizFrame` do).
- **Where things go.**
  - `components/ui/`: generic building blocks with no knowledge of the site's content.
  - `components/layout/`: the page shell.
  - `components/home/`: homepage sections.
  - `components/content/`: rendering of collection entries.
  - `components/visualizations/`: figures.
  - `lib/`: framework-free TypeScript. `lib/viz/` must not import React or touch the DOM.
  - `data/`: typed static data.
- **Layouts.** Top-level section pages use `PageLayout` with a `section` id from `site.ts`.
  Notes use `NoteLayout`. Only those two layouts, the homepage and `404.astro` use
  `BaseLayout` directly.
- **Page structure.** Compose pages from `Section` (rail label, optional index, title and
  lede), `FeatureGrid`, `EmptyState` and `Status` so that rhythm stays consistent.
- **Typography.** Serif (`font-serif`) for display and headings, sans for body and
  interface, `mono-label` for eyebrows, figure numbers and metadata.
- **Links.** Internal links have no trailing slash and no extension: `/knowledge`, not
  `/knowledge/`.
- **Current path.** During a build `Astro.url.pathname` is the output file (`/about.html`,
  `/index.html`). Always pass it through `normalizePath` from `site.ts` before comparing it
  or building a URL from it.
- **TypeScript.** Strict, with `noUncheckedIndexedAccess`. No `any`, and no `as` casts to
  silence the compiler. Zod comes from `astro/zod`; loaders from `astro/loaders`.
- **Scripts in `.astro` files.** Use a plain bundled `<script>`. Since pages are full
  document loads (native view transitions, no client router), no re-initialisation on
  navigation is needed.

## Recipes

### Add a top-level page

1. Add the section to `sections` in `src/config/site.ts`. Navigation, footer and the
   homepage pick it up.
2. Create `src/pages/<id>.astro` using `PageLayout section="<id>"`.

### Add a note

Create `src/content/notes/<name>.md` (or `.mdx` to embed a figure) from
`src/content/notes/_template.md`. Names starting with `_` are ignored. The path becomes
the URL under `/knowledge/`.

### Wire up another collection

Schemas for `paths`, `research`, `projects` and `videos` already exist in
`src/content.config.ts`. Add a query helper to `src/lib/content.ts` that filters drafts in
production (follow `getPublishedNotes`), a listing component in `components/content/`, and
render it in the section page in place of the `EmptyState`.

### Add a visualization

1. Put the maths in `src/lib/viz/`.
2. Create the component in `components/visualizations/<svg|d3|three>/`. Read the README in
   the `d3/` or `three/` folder first.
3. Add it to `registry.ts` with `status: 'live'`.
4. Register it in `Viz.astro` with `client:visible`.

Requirements, all demonstrated by `svg/GradientDescent.tsx`:

- The server render is a complete static figure.
- Per-frame updates write to the DOM through refs. React must not re-render every frame.
- Under reduced motion, show the final state without animating.
- Colours come from the tokens (`var(--accent)`, `currentColor`, token utilities).
- Import the smallest piece of Motion that does the job. `animateValue` and the hooks cost
  about 10 kB gzipped; `animate()` about 26 kB; `motion.*` components about 48 kB.

### Change the social image

Edit `scripts/generate-og.ts`, run `npm run og`, and commit `public/og.png`.

## Deployment

`npm run deploy` builds and runs `wrangler deploy`. `wrangler.jsonc` configures an
assets-only Worker serving `dist/`. `html_handling` and `not_found_handling` there must
stay consistent with `trailingSlash` and `build.format` in `astro.config.mjs`. Response
headers are in `public/_headers`. Pushes to `main` deploy through
`.github/workflows/deploy.yml`; that workflow needs `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` as repository secrets.
