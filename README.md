# Mohammad Amin Karimi | Portfolio / رزومه

A bilingual (فارسی / English) developer portfolio built with **Next.js 16 (App Router) + React 19 + TypeScript + Three.js**. It is statically exported (`output: 'export'`) and deployed to GitHub Pages by GitHub Actions.

**Design:** redesigned with the project's `taste-skill` / `redesign-skill` (see [`.claude/skills`](.claude/skills)). The base is a neutral zinc palette with a single electric-blue accent. Type is Geist / Geist Mono, with Vazirmatn for Persian, all self-hosted through `next/font`. Icons come from Phosphor. The hero is a real-time 3D code editor in an exploded view: backplate, file explorer, glass sheet, accent frame, the editor typing out `amin.tsx`, an autocomplete popup and a terminal. The layers drift apart on load, follow the pointer, and spread further as you scroll past. The profile photo sits in the About panel.

## Features

- **3D editor hero (Three.js):** loaded lazily. The editor panels are painted on 2D canvases (`src/components/editorArt.ts`) and used as textures. A flat, tilted render of the editor shows first. It also stays as the fallback when WebGL is missing or software-only (SwiftShader, llvmpipe), so machines without a GPU are not slowed down. On a slow GPU the scene drops to 1x resolution, then to a still frame. Rendering pauses off-screen and is static under `prefers-reduced-motion`. The scene's page-coloured parts read the CSS theme tokens.
- **Bilingual, RTL/LTR, pre-rendered:** Persian lives at `/` and English at `/en/`. The 3D scene mirrors itself for RTL. Switch languages with the header button or the `L` key.
- **Dark / light themes:** follows the system setting and remembers your choice. Shortcut: `T`.
- **Interactive 3D editor:** the panels in the hero are real controls. Explorer files jump to their section, autocomplete items trace that technology in the dependency graph, the editor opens the playground and the terminal panel opens the terminal. three.js is only downloaded after the page has loaded and gone idle, and never on software-only WebGL or with data saver on.
- **Dependency graph:** every technology wired to the projects that use it, straight from `cv.ts` (`StackGraph.tsx`). Hover, focus or tap a node to trace its links.
- **Lighthouse from CI:** the deploy workflow runs Lighthouse (mobile) against the built site and writes `out/lighthouse.json` (`scripts/lighthouse.mjs`). The footer and the terminal's `lighthouse` command show those real scores. The step never blocks a deploy.
- **Changelog** (`/changelog/`, `/en/changelog/`): generated at build time from this repository's own `git log --first-parent`. Merged pull requests list the commits they brought in. CI checks out full history for it.
- **Vim motions:** `j` / `k` move between sections, `gg` jumps to the top and `G` to the bottom.
- **Contact as an API request:** a Postman-style `POST` form with validation and a response panel. Set a repository variable `FORM_ENDPOINT` (e.g. a Formspree form URL) under *Settings → Secrets and variables → Actions → Variables* to send real requests. Without it, the form opens the visitor's mail app with the message filled in.
- **Git graph experience:** the work history is drawn as `git log --graph`. Each job is a commit on its own branch (`main`, `ml/research`, `feat/sido`) that forks from `main` in the year it started. Branch, lane and start year live on each job in `cv.ts`.
- **GitHub, live:** the latest real commits from the three most recently pushed repos, public repo and star counts, and language shares, from the public GitHub API (`src/lib/github.ts`, cached for 10 minutes per session), with loading, error and empty states. The terminal's `git log` uses the same data.
- **Playground:** visitors edit and run JavaScript against the page's own data (`amin`). The code runs in a Web Worker with a 1.5s timeout, so a bad snippet can't freeze the page. There are four ready-made examples, and `⌘/Ctrl + Enter` runs the code.
- **Status bar** (desktop): VS Code-style, with the branch, the "file" of the section in view, a scroll percentage from a pure-CSS scroll-driven counter, and Tehran time.
- **Source view** (`S`, the `{ }` button, or the palette): every section flips in 3D to the file it is built from (`about.md`, `skills.json`, `experience.ts`, `projects.ts`, `contact.sh`). The code is generated from the real data in `cv.ts` (`src/lib/source.ts`), syntax-highlighted, with a copy button.
- **Inspect mode** (`I`): a DevTools-style overlay. Hover any element to see its selector and size; click to copy the selector. `Esc` exits.
- **Live Web Vitals** in the footer: LCP, CLS, INP and page weight of the current visit, measured in the visitor's browser with `PerformanceObserver` (`src/lib/vitals.ts`).
- **Decoding headings:** section titles resolve from random glyphs (Persian letters on the Persian page) as they scroll in. Their height is fixed while scrambling, so there is no layout shift.
- **Interactive terminal** (`` ` ``) with `git log` / `git branch` / `git status`, `typing-test` (code typing speed, WPM and accuracy), `lighthouse`, `changelog`, `neofetch`, `perf`, `cat <file>` (prints a section's source), `ls`, `source`, `inspect` and more, plus the **command palette** (`⌘K` / `Ctrl+K` / `/`).
- **Printable CV:** the "Download CV" button prints a clean A4 resume in the current language.
- **Motion:** sections rise out of a slight 3D tilt as they enter the viewport. Screenshots tilt toward the pointer. The timeline line fills with a CSS scroll-driven animation. There are no scroll listeners, and everything honours `prefers-reduced-motion`.

## Sido screenshot

The featured Sido block is text-led until you add a real screenshot. Save a 1100×520 capture of https://sido.ir as `public/img/sido.webp` and it will appear under the block automatically.

## Editing content

**All text lives in [`src/data/cv.ts`](src/data/cv.ts)** and is type-checked against `src/data/types.ts`. Every field has the form `{ fa, en }`. To update the resume you edit this one file: skills (`level` 1-5; level 5 renders as a solid pill), experience, projects (`featured`, `highlights`, `img`) and contact links.

## Structure

```
src/
├─ app/
│  ├─ (fa)/layout.tsx, page.tsx      → /      (Persian, RTL)
│  ├─ (en)/en/layout.tsx, page.tsx   → /en/   (English, LTR)
│  ├─ globals.css                    design tokens (dark/light), layout, 3D motion, print CV
│  ├─ fonts.ts                       Geist, Geist Mono, Vazirmatn via next/font
│  └─ fonts/                         Vazirmatn variable font
├─ components/
│  ├─ Portfolio.tsx                  page composition (server component)
│  ├─ Hero, About, Skills, Experience, Contact, Footer, PrintCV   (server)
│  ├─ HeroScene.tsx                  Three.js exploded 3D editor (client, lazy)
│  ├─ editorArt.ts                   canvas painting for the editor, explorer, popup, terminal
│  ├─ Work.tsx, Shot.tsx             featured project, screenshot gallery with 3D tilt, open source
│  ├─ Terminal.tsx, Palette.tsx, Overlays.tsx   interactive shell, ⌘K, shortcuts (client)
│  ├─ SourceView.tsx, Inspector.tsx, PerfStats.tsx   source view, inspect mode, live vitals
│  └─ Effects.tsx                    reveals, heading decode, active nav, pointer tilt, clock (client)
├─ data/cv.ts, types.ts              all content (FA + EN), typed
└─ lib/                              i18n, client utilities, metadata, source.ts (data → code), vitals.ts
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
