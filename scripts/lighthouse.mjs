#!/usr/bin/env node
/**
 * Runs Lighthouse against the static export in ./out and writes a small summary to
 * out/lighthouse.json, which the site reads and shows. Used by the deploy workflow:
 *
 *   BASE_PATH=/Resume node scripts/lighthouse.mjs
 *
 * Serves ./out under BASE_PATH on a local port with a tiny static server (no dependencies),
 * gzip-compressed like GitHub Pages serves it, then calls the Lighthouse CLI (mobile emulation, simulated throttling, the Lighthouse default).
 */
import { createServer } from 'node:http';
import { readFile, stat, writeFile, mkdtemp } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join } from 'node:path';
import { tmpdir } from 'node:os';
import { gzipSync } from 'node:zlib';

const OUT = 'out';
const BASE = process.env.BASE_PATH ?? '';
const PORT = Number(process.env.LH_PORT ?? 4400);
const PAGE = process.env.LH_PAGE ?? '/en/';
const VERSION = process.env.LH_VERSION ?? '13';
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.woff2': 'font/woff2', '.txt': 'text/plain', '.webmanifest': 'application/manifest+json' };

const server = createServer(async (req, res) => {
  const url = decodeURIComponent((req.url ?? '/').split('?')[0]);
  if (!url.startsWith(BASE)) { res.writeHead(404).end(); return; }
  let file = join(OUT, url.slice(BASE.length));
  try { if ((await stat(file)).isDirectory()) file = join(file, 'index.html'); } catch { /* 404 below */ }
  try {
    const body = await readFile(file);
    const type = TYPES[extname(file)] ?? 'application/octet-stream';
    // GitHub Pages compresses text responses; do the same so the numbers match production.
    const gzip = /gzip/.test(req.headers['accept-encoding'] ?? '') && /text|javascript|json|svg|manifest/.test(type);
    res.writeHead(200, { 'content-type': type, ...(gzip ? { 'content-encoding': 'gzip' } : {}) }).end(gzip ? gzipSync(body) : body);
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => server.listen(PORT, ok));

const target = `http://localhost:${PORT}${BASE}${PAGE}`;
const report = join(await mkdtemp(join(tmpdir(), 'lh-')), 'report.json');
// Async on purpose: the static server above runs in this same process.
const status = await new Promise((done) => {
  spawn('npx', ['--yes', `lighthouse@${VERSION}`, target,
    '--output=json', `--output-path=${report}`, '--quiet',
    '--only-categories=performance,accessibility,best-practices,seo',
    '--chrome-flags=--headless=new --no-sandbox --disable-dev-shm-usage'], { stdio: 'inherit' }).on('close', done);
});
server.close();
if (status !== 0) { console.error('lighthouse failed'); process.exit(1); }

const lh = JSON.parse(await readFile(report, 'utf8'));
const score = (id) => Math.round((lh.categories[id]?.score ?? 0) * 100);
const metric = (id) => ({ value: lh.audits[id]?.numericValue ?? null, display: lh.audits[id]?.displayValue ?? '' });
const summary = {
  at: lh.fetchTime,
  sha: process.env.GITHUB_SHA ?? null,
  lighthouse: lh.lighthouseVersion,
  page: PAGE,
  device: lh.configSettings?.formFactor ?? 'mobile',
  scores: { performance: score('performance'), accessibility: score('accessibility'), bestPractices: score('best-practices'), seo: score('seo') },
  metrics: { fcp: metric('first-contentful-paint'), lcp: metric('largest-contentful-paint'), tbt: metric('total-blocking-time'), cls: metric('cumulative-layout-shift'), si: metric('speed-index') },
};
await writeFile(join(OUT, 'lighthouse.json'), JSON.stringify(summary, null, 2));
console.log('Lighthouse:', summary.scores);
