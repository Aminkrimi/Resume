# Mohammad Amin Karimi — Portfolio / رزومه

A bilingual (فارسی / English) personal site with dark and light themes, built with plain HTML, CSS and JS. There is no build step.

**Concept — "Source":** the resume is presented as a codebase. The hero shows a code editor that types out `amin.tsx`, sections are named like files (`about.md`, `skills.json`, `experience.log`, `projects/`), the work history reads like a `git log`, and there's a real interactive terminal. The palette is blue and cyan.

## Features

- **Bilingual, RTL/LTR:** Persian is the default. Switch with the header button or the `L` key. You can link straight to English with `?lang=en`.
- **Dark / light themes (blue palette):** follows the system setting and remembers your choice. The switch animates as a circular reveal (View Transitions API). Shortcut: `T`.
- **Interactive terminal:** open it with the `` ` `` key or the hero button. Commands include `help`, `whoami`, `skills`, `experience`, `projects`, `open <id>`, `contact`, `theme`, `lang`, `cv`, and `sudo hire-me` 😄. It supports history (↑/↓) and Tab completion.
- **Command palette:** open with `⌘K` / `Ctrl+K` or `/`.
- **Printable CV:** the "Download CV" button prints a clean A4 resume in the current language.
- **Live GitHub contribution chart**, a filterable project grid, animated skill meters, a timeline progress bar, a live Tehran clock, SEO and Open Graph tags, JSON-LD, `prefers-reduced-motion` support and keyboard access.

## Sido screenshot

The Sido card shows a browser mock until you add a real screenshot. Save a 16:10 capture of https://sido.ir as `assets/img/sido.webp` (or `.jpg`, then update `img` in `data.js`) and it will appear automatically.

## Editing content

**All text lives in [`assets/js/data.js`](assets/js/data.js).** Every field has the form `{ fa, en }`. To update the resume you edit this one file: skills (`level` 1–5), experience, projects (`cat` sets the filter tags) and contact links.

## Structure

```
index.html             page shell + SVG icon sprite
assets/css/main.css    design tokens (dark/light), layout, print CV
assets/js/data.js      all content (FA + EN)
assets/js/main.js      rendering + interactions
assets/img/            optimized WebP images, favicon
content/               original images + IRANSans fonts
Resume.html            redirects to index.html (keeps old links working)
```

## Run locally

Open `index.html` directly, or serve the folder:

```bash
npx serve .
```

To publish on GitHub Pages: Settings → Pages → deploy from branch → root.
