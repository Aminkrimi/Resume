// Renders the built résumé (dist/) in headless Chromium and saves an A4 PDF.
// Usage: npm run pdf  ->  ../public/Amin-Karimi-Resume.pdf
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dist = join(root, 'dist');
const out = resolve(root, process.argv[2] ?? '../public/Amin-Karimi-Resume.pdf');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.woff2': 'font/woff2', '.svg': 'image/svg+xml' };

/**
 * Uses the first browser that starts: CHROMIUM_PATH, Playwright's own Chromium,
 * then the Chrome or Edge already installed on the machine (Edge ships with Windows),
 * so `npx playwright install` is optional.
 */
async function launchBrowser() {
  const options = [
    process.env.CHROMIUM_PATH && { executablePath: process.env.CHROMIUM_PATH },
    {},
    { channel: 'chrome' },
    { channel: 'msedge' },
  ].filter(Boolean);
  for (const option of options) {
    try {
      return await chromium.launch(option);
    } catch {
      // try the next one
    }
  }
  throw new Error('No Chromium found. Install Chrome or Edge, run `npx playwright install chromium`, or set CHROMIUM_PATH.');
}

const server = createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  const path = join(dist, pathname.endsWith('/') ? `${pathname}index.html` : pathname);
  try {
    const file = await readFile(path);
    res.writeHead(200, { 'content-type': types[extname(path)] ?? 'application/octet-stream' }).end(file);
  } catch {
    res.writeHead(404).end();
  }
}).listen(0);

const { port } = server.address();
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  const overflow = await page.evaluate(() => {
    const sheet = document.querySelector('main');
    return sheet.scrollHeight - sheet.clientHeight;
  });
  if (overflow > 1) throw new Error(`Résumé overflows the A4 sheet by ${overflow}px. Trim content.`);

  await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true, tagged: true });
  console.log(`PDF written to ${out}`);
} finally {
  await browser.close();
  server.close();
}
