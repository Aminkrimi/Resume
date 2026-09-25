# Mohammad Amin Karimi — Portfolio / رزومه

A bilingual (فارسی / English) developer portfolio built with **Next.js 16 (App Router) + React 19 + TypeScript**. It is statically exported (`output: 'export'`) and deployed to GitHub Pages by GitHub Actions.

**Concept — "Source":** the resume is presented as a codebase. The hero shows a code editor that types out `amin.tsx`, sections are named like files (`about.md`, `skills.json`, `experience.log`, `projects/`), the work history reads like a `git log`, and there's a real interactive terminal. The palette is blue and cyan.

## Features

- **Bilingual, RTL/LTR, pre-rendered:** Persian lives at `/` and English at `/en/`. Both are static HTML pages, which is better for SEO. Switch with the header button or the `L` key.
- **Dark / light themes (blue palette):** follows the system setting and remembers your choice. The switch animates as a circular reveal (View Transitions API). Shortcut: `T`.
- **Interactive terminal:** open it with the `` ` `` key or the hero button. Commands include `help`, `whoami`, `skills`, `experience`, `projects`, `open <id>`, `contact`, `theme`, `lang`, `cv`, and `sudo hire-me` 😄. It supports history (↑/↓) and Tab completion.
- **Command palette:** open with `⌘K` / `Ctrl+K` or `/`.
- **Printable CV:** the "Download CV" button prints a clean A4 resume in the current language.
- **Live GitHub contribution chart**, a filterable project grid, animated skill meters, a timeline progress bar, a live Tehran clock, SEO and Open Graph tags, JSON-LD, `prefers-reduced-motion` support and keyboard access.

## Sido screenshot

The Sido card shows a browser mock until you add a real screenshot. Save a 16:10 capture of https://sido.ir as `public/img/sido.webp` (or `.jpg`, then update `img` in `src/data/cv.ts`) and it will appear automatically.

## Editing content

**All text lives in [`src/data/cv.ts`](src/data/cv.ts)** and is type-checked against `src/data/types.ts`. Every field has the form `{ fa, en }`. To update the resume you edit this one file: skills (`level` 1–5), experience, projects (`cat` sets the filter tags) and contact links.

## Structure

```
src/
├─ app/
│  ├─ (fa)/layout.tsx, page.tsx      → /      (Persian, RTL)
│  ├─ (en)/en/layout.tsx, page.tsx   → /en/   (English, LTR)
│  ├─ globals.css                    design tokens (dark/light), layout, print CV
│  └─ fonts/                         IRANSans (self-hosted)
├─ components/
│  ├─ Portfolio.tsx                  page composition (server component)
│  ├─ Hero, About, Skills, Experience, Contact, Footer, PrintCV   (server)
│  ├─ Work.tsx                       project grid + filters (client)
│  ├─ Terminal.tsx, Palette.tsx, Overlays.tsx   interactive shell, ⌘K, shortcuts (client)
│  ├─ Effects.tsx                    scroll reveal, counters, clock, spotlight (client)
│  └─ Typers.tsx                     typing role + code editor (client)
├─ data/cv.ts, types.ts              all content (FA + EN), typed
└─ lib/                              i18n helpers, client utilities, metadata
public/img/                          optimized WebP images, favicon
.github/workflows/deploy.yml         lint → typecheck → build → deploy to Pages
```

## Develop

```bash
npm install
npm run dev         # http://localhost:3000
npm run lint        # ESLint (next config)
npm run typecheck   # tsc --noEmit
npm run build       # static export to ./out
```

## Deploy (GitHub Pages)

1. Repo **Settings → Pages → Build and deployment → Source: GitHub Actions**.
2. Push to `main`. The workflow builds with `BASE_PATH=/Resume` and publishes to https://aminkrimi.github.io/Resume/
