# One-page résumé (A4 PDF)

React + TypeScript + Tailwind CSS v4, built with Vite and exported to PDF with headless Chromium.

- **Content:** `src/data/resume.ts` holds all the text. Components only render it.
- **Layout:** header, a 35% sidebar (skills, strengths, education), a 65% main column (summary, experience timeline, projects) and a highlights footer, sized to exactly 210 × 297 mm.

```bash
cd cv
npm install
npm run dev          # live preview in the browser
npm run pdf          # writes ../public/Amin-Karimi-Resume.pdf
```

`npm run pdf` uses Playwright's Chromium. If you only have a system Chrome or Chromium, point to it:
`CHROMIUM_PATH=/path/to/chrome npm run pdf`. The export fails loudly if the content spills past one A4 page.
