# Mohammad Amin Karimi — Portfolio / رزومه

A bilingual (فارسی / English) personal site with dark and light themes, built with plain HTML, CSS and JS. There is no build step.

**Concept — "LIVE":** a front-end engineer who also works behind the camera. The page is designed like a broadcast: a viewfinder hero with a REC tally and a running timecode, sections labeled as *scenes*, a clapperboard intro and a "That's a wrap" footer.

## Features

- **Bilingual, RTL/LTR:** Persian is the default. Switch with the header button or the `L` key. You can link straight to English with `?lang=en`.
- **Dark / light themes:** follows the system setting and remembers your choice. The switch animates as a circular reveal (View Transitions API). Shortcut: `T`.
- **Command palette:** open with `⌘K` / `Ctrl+K` or `/`. It navigates sections, switches theme and language, copies the email, prints the CV and more.
- **Printable CV:** the "Download CV" button prints a clean A4 resume, rendered from the same data in the current language.
- **Viewfinder cursor:** frames links and buttons on desktop. The hero photo has a focus point that follows the mouse; click it to take a "shot".
- **Easter egg:** the Konami code (↑↑↓↓←→←→BA) turns on *Director mode*.
- Also included: scroll reveals, animated skill meters, a timeline progress bar, a filterable project grid, a live Tehran clock, SEO and Open Graph tags, JSON-LD, a web manifest, `prefers-reduced-motion` support and keyboard access.

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
