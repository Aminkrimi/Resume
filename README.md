# Mohammad Amin Karimi | Portfolio / رزومه

A bilingual (فارسی / English) developer portfolio built with **Next.js 16 (App Router) + React 19 + TypeScript + Three.js**. It is statically exported (`output: 'export'`) and deployed to GitHub Pages by GitHub Actions.

**Design:** redesigned with the project's `taste-skill` / `redesign-skill` (see [`.claude/skills`](.claude/skills)). The base is a neutral zinc palette with a single electric-blue accent. Type is Geist / Geist Mono, with Vazirmatn for Persian, all self-hosted through `next/font`. Icons come from Phosphor. The hero is a real-time 3D code editor in an exploded view: backplate, file explorer, glass sheet, accent frame, the editor typing out `amin.tsx`, an autocomplete popup and a terminal. The layers drift apart on load, follow the pointer, and spread further as you scroll past. The profile photo sits in the About panel.

## Features

- **3D editor hero (Three.js):** loaded lazily. The editor panels are painted on 2D canvases (`src/components/editorArt.ts`) and used as textures. A flat, tilted render of the editor shows first. It also stays as the fallback when WebGL is missing or software-only (SwiftShader, llvmpipe), so machines without a GPU are not slowed down. On a slow GPU the scene drops to 1x resolution, then to a still frame. Rendering pauses off-screen and is static under `prefers-reduced-motion`. The scene's page-coloured parts read the CSS theme tokens.
- **Bilingual, RTL/LTR, pre-rendered:** Persian lives at `/` and English at `/en/`. The 3D scene mirrors itself for RTL. Switch languages with the header button or the `L` key.
- **Dark / light themes:** follows the system setting and remembers your choice. Shortcut: `T`.
- **Interactive terminal** (`` ` ``) and **command palette** (`⌘K` / `Ctrl+K` / `/`).
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
│  └─ Effects.tsx                    reveals, active nav, pointer tilt, clock (client)
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
