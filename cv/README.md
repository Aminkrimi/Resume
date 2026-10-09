# One-page résumé (A4 PDF)

React + TypeScript + Tailwind CSS v4, built with Vite and exported to PDF with headless Chromium.

- **Content:** comes from the portfolio's `../src/data/cv.ts`, so the site and the PDF stay in sync. `src/data/resume.ts` picks the English text, chooses what fits on one page and holds the few resume-only lines (summary, strengths). Set `LINKEDIN` there to swap Telegram for LinkedIn in the header.
- **After editing `cv.ts`:** run `npm run pdf` again and commit the new `public/Amin-Karimi-Resume.pdf`.
- **Layout:** header, a 35% sidebar (skills, strengths, education), a 65% main column (summary, experience timeline, projects, client websites) and a highlights footer, sized to exactly 210 × 297 mm.

```bash
cd cv
npm install
npm run dev          # live preview in the browser
npm run pdf          # writes ../public/Amin-Karimi-Resume.pdf
```

`npm run pdf` uses the first browser it finds: `CHROMIUM_PATH`, Playwright's Chromium, then the installed Chrome or Edge (so on Windows it just works). To use a specific one:
`CHROMIUM_PATH=/path/to/chrome npm run pdf`. The export fails loudly if the content spills past one A4 page.
