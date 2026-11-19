# ranjeetdhumal.com

A personal AI research and interactive learning platform: short visual notes, interactive
figures, code and structured learning paths across AI, machine learning, generative and
agentic AI, Python and the mathematics underneath.

This repository is the first milestone: the foundation. The design system, layout,
navigation, every top-level page, the content pipeline and one working interactive figure
are in place. The content itself comes next.

## Quick start

Requires **Node 24** (Astro 7 needs Node 22.23.4 or newer; `.nvmrc` pins 24) and npm.

```sh
nvm use          # reads .nvmrc
npm install
npm run dev      # http://localhost:4321
```

| Command           | What it does                                                          |
| ----------------- | --------------------------------------------------------------------- |
| `npm run dev`     | Start the dev server with hot reload. Drafts are visible.             |
| `npm run check`   | Type-check `.astro`, `.ts` and `.tsx` files.                          |
| `npm run build`   | Build the static site into `dist/`. Drafts are excluded.              |
| `npm run preview` | Serve `dist/` locally.                                                |
| `npm run og`      | Regenerate `public/og.png`, the social sharing image.                 |
| `npm run deploy`  | Build, then deploy `dist/` to Cloudflare Workers.                     |

## Stack

| Concern        | Choice                                                                    |
| -------------- | ------------------------------------------------------------------------- |
| Framework      | Astro 7, `output: 'static'`                                               |
| Interactivity  | React 19 islands, TypeScript (strict)                                     |
| Styling        | Tailwind CSS 4, configured in CSS (`src/styles/global.css`)               |
| Content        | Markdown and MDX content collections                                      |
| Animation      | CSS first; Motion inside interactive figures only                         |
| Fonts          | Instrument Sans, Newsreader, JetBrains Mono (self-hosted via Fontsource)  |
| Hosting        | Cloudflare Workers static assets (`wrangler.jsonc`)                       |
| Not yet added  | Pagefind (search), D3 and Three.js (folders and conventions are ready)    |

## Architecture

### Principles

1. **Static first.** Every page is prerendered HTML. There is no server.
2. **No JavaScript by default.** A page without a figure ships about 1 kB of link
   prefetching and a small inline script for the theme toggle and mobile menu. React loads
   only on pages that contain a figure, and only when the figure scrolls into view.
3. **One source of truth per concern.** Navigation and section copy live in one file, design
   tokens in another, figures in a registry. Pages read from these and never repeat them.
4. **Figures work before they hydrate.** A figure's server render is a complete, meaningful
   static image. JavaScript adds interaction on top.

### The learning path

The story a newcomer is meant to follow is **From Data to Intelligence**
(`src/content/paths/from-data-to-intelligence.md`, `primary: true`). Nine chapters, in
dependency order:

1. A sample and its mean
2. A learning problem
3. How a network computes
4. How training moves
5. Representations
6. Attention
7. A language model
8. Evaluation and alignment
9. An agent

Each chapter in that file has an outcome, the concepts it depends on, why they matter, and
what the next chapter assumes. Optional fields hang the rest of the site off the chapter:
`article` (a Knowledge Hub path), `figure` (a visualization id), `experiment` (a sentence),
and `reading` (a lecture anchor). The homepage reads this file, so the chapter list cannot
drift.

The other paths are branches. Take one when a chapter needs more ground, then come back.

Essays live in `src/content/notes/` as MDX. A note can embed a live figure with
`<Viz id="…" />` and no import. Lectures live in `src/content/videos/`. `origin: curated`
plus a YouTube `url` embeds the film. `origin: original` with no `url` is a film this
notebook has not made. The contact form posts to `site.contactFormAction` when that string
is set, and otherwise opens the visitor's mail client. No form host is configured.

### Project structure

```text
src/
├── config/site.ts            Site identity, sections and navigation (single source of truth)
├── data/                     Typed data: topics.ts (the eight fields), resume.ts
├── content.config.ts         Content collection schemas
├── content/                  Markdown and MDX: notes, paths, research, projects, videos
├── styles/global.css         Design system: tokens, Tailwind theme, utilities
├── layouts/
│   ├── BaseLayout.astro      <html>, head, header, footer
│   ├── PageLayout.astro      Section landing pages (reads copy from site.ts)
│   └── NoteLayout.astro      A single note: metadata rail and prose column
├── components/
│   ├── layout/               BaseHead, Header, MobileMenu, ThemeToggle, Footer
│   ├── ui/                   Button, Section, PageHeader, EmptyState, Status, CodeListing, …
│   ├── home/                 Homepage sections
│   ├── content/              Listings for collection entries
│   └── visualizations/       Interactive figures (see "Visualizations")
├── lib/
│   ├── content.ts            Collection queries and helpers
│   ├── seo.ts                JSON-LD builders
│   └── viz/                  Framework-free maths shared by figures and scripts
└── pages/                    One file per route
public/                       favicon.svg, og.png, _headers
scripts/generate-og.ts        Builds public/og.png from the same maths as the hero figure
```

### Routes

| Route               | Source                                | Notes                                   |
| ------------------- | ------------------------------------- | --------------------------------------- |
| `/`                 | `pages/index.astro`                   | Hero figure, fields, method, explore    |
| `/knowledge`        | `pages/knowledge/index.astro`         | Latest notes and the eight fields       |
| `/knowledge/<note>` | `pages/knowledge/[...slug].astro`     | One page per file in `content/notes`    |
| `/learning-paths`   | `pages/learning-paths.astro`          |                                         |
| `/visual-lab`       | `pages/visual-lab.astro`              | Renders the visualization registry      |
| `/videos`           | `pages/videos.astro`                  |                                         |
| `/research`         | `pages/research.astro`                |                                         |
| `/projects`         | `pages/projects.astro`                |                                         |
| `/about`            | `pages/about.astro`                   |                                         |
| `/resume`           | `pages/resume.astro`                  | Driven by `data/resume.ts`              |
| `/404`              | `pages/404.astro`                     | Served by Cloudflare for unknown paths  |
| `/robots.txt`       | `pages/robots.txt.ts`                 | Plus `sitemap-index.xml` from the build |

URLs have no trailing slash and no extension. Astro emits `knowledge.html`
(`build.format: 'file'`), and Cloudflare serves it at `/knowledge`.

## Design system

Everything is defined in `src/styles/global.css`. Tailwind 4 is configured in CSS, so there
is no `tailwind.config.js`.

- **Colour.** Eleven semantic tokens (`canvas`, `surface`, `raised`, `line`, `line-strong`,
  `ink`, `ink-muted`, `ink-faint`, `accent`, `accent-ink`, `signal`), each defined once for
  the dark theme and once for the light theme. Tailwind's default palette is removed, so
  `bg-canvas` and `text-ink-muted` exist and `bg-slate-900` does not. Because the tokens
  switch with the theme, components almost never need a `dark:` variant. All text colours
  meet WCAG AA contrast in both themes.
- **Type.** Newsreader (serif) for display and headings, Instrument Sans for interface and
  body, JetBrains Mono for labels and code. Fluid sizes: `text-display`, `text-headline`,
  `text-title`, `text-lede`, `text-label`.
- **Layout.** `max-w-page` (80rem) and `max-w-prose` (44rem), `px-gutter` and `py-section`
  for fluid spacing. Surfaces are drawn with hairlines rather than cards and shadows.
- **Utilities.** `mono-label`, `bg-dotgrid`, `link-underline`, `rise` (staggered entrance)
  and `reveal` (scroll-linked fade-in).
- **Theme.** Dark is the default: `<html class="dark">` is in the server-rendered markup,
  and a tiny inline script removes it before first paint if the visitor chose light. The
  choice is stored in `localStorage.theme`.
- **Motion.** Entrances, scroll reveals and page transitions are CSS only. Page transitions
  use native cross-document view transitions, so no client router is shipped. All of it is
  disabled under `prefers-reduced-motion`.

## Writing content

Content lives in `src/content/<collection>/` as `.md` or `.mdx`. Schemas are in
`src/content.config.ts`, and the build fails with a clear message if frontmatter is wrong.

| Collection | Folder              | Published at        | Status in this milestone             |
| ---------- | ------------------- | ------------------- | ------------------------------------ |
| `notes`    | `content/notes/`    | `/knowledge/<path>` | Wired end to end                     |
| `paths`    | `content/paths/`    | `/learning-paths`   | Five sequenced paths                 |
| `research` | `content/research/` |                     | Posted papers and planned entries    |
| `projects` | `content/projects/` | `/projects`         | Public repositories                  |
| `videos`   | `content/videos/`   |                     | Planned films; a URL makes one live  |

To add a note, copy `src/content/notes/_template.md`, rename it, and fill in the
frontmatter:

```yaml
---
title: Why momentum helps
description: One sentence that says what the reader will understand afterwards.
topic: mathematics        # optional; one of the ids in src/data/topics.ts
maturity: seedling        # seedling | budding | evergreen
publishedAt: 2026-11-18
tags: [optimization]
draft: false
---
```

The file path becomes the URL: `notes/optimization/momentum.md` is published at
`/knowledge/optimization/momentum`.

### Working from Obsidian

The collections are set up so that `src/content/` (or any folder inside it) can be opened as
an Obsidian vault:

- Plain `.md` files work. Use `.mdx` only when a note embeds a figure.
- Frontmatter is ordinary YAML, including `tags` and `aliases` lists and `2026-11-18` dates.
- Files and folders whose names start with `_` are ignored, so templates, scratch notes and
  attachments folders can live in the vault without being published.
- `draft: true` keeps a note out of production builds while it remains visible in
  `npm run dev`.

Not handled yet: Obsidian `[[wikilinks]]` and `![[embeds]]`. Use standard Markdown links
until a remark plugin is added. The `aliases` field is reserved for that.

### Embedding a figure

In an `.mdx` note, with no import needed:

```mdx
<Viz id="gradient-descent" />
```

## Visualizations

```text
src/components/visualizations/
├── registry.ts      Catalogue of every figure, live or planned
├── Viz.astro        Maps a figure id to its component and hydration strategy
├── VizFrame.astro   Shared figure chrome: number, title, engine, caption
├── svg/             React + SVG figures (GradientDescent.tsx is the reference)
├── d3/              Placeholder with conventions; D3 is not installed yet
└── three/           Placeholder with conventions; Three.js is not installed yet
```

To add a figure:

1. Put pure maths in `src/lib/viz/` so that it can be tested and reused outside React.
2. Write the component in the folder for its engine.
3. Add an entry to `registry.ts` with `status: 'live'`. The Visual Lab page lists it
   automatically.
4. Register the component in `Viz.astro` with `client:visible`.

Every figure must render completely on the server, respect `prefers-reduced-motion`, and
give any pointer interaction a keyboard equivalent. `svg/GradientDescent.tsx` shows all
three.

Motion is imported piecemeal to keep figures light. `animateValue` plus the hooks costs
about 10 kB gzipped; the general `animate()` is about 26 kB and the `motion.*` components
about 48 kB.

## SEO

`BaseHead.astro` emits the title, description, canonical URL, Open Graph and Twitter tags
for every page. `src/lib/seo.ts` builds the JSON-LD (`WebSite`, `Person`, `BreadcrumbList`,
`TechArticle`). The build generates `sitemap-index.xml` and `robots.txt`. The production
origin is set once, as `site` in `astro.config.mjs`.

## Deploying to Cloudflare

The site deploys as a Worker with static assets only, with no Worker script. `wrangler.jsonc`
points at `dist/`, serves extensionless URLs, and returns `404.html` with a 404 status for
unknown paths. `public/_headers` sets security headers and long-lived caching for
fingerprinted assets under `/_astro/`.

A push to `main` runs `.github/workflows/deploy.yml`: type-check, build, then
`wrangler deploy`. The same command works locally after one login:

```sh
npx wrangler login     # once
npm run deploy         # astro build && wrangler deploy
```

The workflow reads two repository secrets:

| Secret | Where to get it |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard → My Profile → API Tokens → Create Token → template **Edit Cloudflare Workers** |
| `CLOUDFLARE_ACCOUNT_ID` | Workers overview, in the right-hand account details |

```sh
gh secret set CLOUDFLARE_API_TOKEN
gh secret set CLOUDFLARE_ACCOUNT_ID
```

`ranjeetdhumal.com` and `www.ranjeetdhumal.com` are custom domains on the Worker.
The zone uses Cloudflare nameservers. Delete any imported Namecheap URL-forward
records for the apex and `www` before deploying; a custom domain cannot replace
a record it does not own. A deploy then creates the DNS records and certificates.

## Before launch

The biography, résumé, email and public profiles are filled from the author's LinkedIn, GitHub
and November 2025 résumé. The résumé PDF is not published: it contains a home address and a
phone number. Attach the domain after the first deploy (see above).

## Expected build output

`npm run build` prints one warning for each empty collection, for example
`No files found matching "**/*.{md,mdx},…" in directory "src/content/paths"`. This is
expected until those collections have content, and each warning disappears with the first
file added.

## Roadmap

1. Real content: the first notes, then a first learning path.
2. Wire `paths`, `research`, `projects` and `videos` into their pages, with detail routes
   where they earn one.
3. Search with Pagefind. Note pages already mark their body with `data-pagefind-body`.
4. First D3 figure (decision boundaries) and first Three.js figure (embedding space).
5. Obsidian wikilink support, an RSS feed, and per-note social images.
