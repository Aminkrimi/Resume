/**
 * 2D canvas art for the hero's 3D editor. Each panel is painted here and then used as a
 * texture in HeroScene; the editor is also painted once as the no-WebGL fallback.
 * The editor is always dark, like a real one, in both page themes.
 */

export type TokenKind = 'k' | 's' | 'f' | 'n' | 'c' | 'p' | 'u' | 'b';
export type Token = [kind: TokenKind, text: string];
export type CodeLines = Token[][];

const SX: Record<TokenKind, string> = {
  k: '#8aa4f0', // keyword
  s: '#b5c99a', // string
  f: '#e2c07a', // function / type
  n: '#e59a7a', // number
  c: '#6b7280', // comment
  p: '#d9dce3', // property / identifier
  u: '#9aa0ab', // punctuation
  b: '#8aa4f0', // boolean
};

const C = {
  bg: '#0f1115',
  chrome: '#0b0c0f',
  line: 'rgba(255,255,255,0.07)',
  text: '#d9dce3',
  muted: '#7c828e',
  faint: '#4b5160',
  accent: '#708fea',
  accentSoft: 'rgba(112,143,234,0.18)',
  ok: '#4fbf8b',
};

export const EDITOR_PX = { w: 1400, h: 1000 };
export const TREE_PX = { w: 460, h: 1160 };
export const SUGGEST_PX = { w: 600, h: 392 };
export const TERM_PX = { w: 920, h: 248 };

export const totalChars = (lines: CodeLines) => lines.reduce((a, l) => a + l.reduce((b, [, s]) => b + s.length, 0) + 1, 0);

/** The monospace stack next/font registered for Geist Mono. */
export function monoFamily() {
  const v = getComputedStyle(document.documentElement).getPropertyValue('--font-geist-mono').trim();
  return v || 'ui-monospace, Menlo, monospace';
}

export function drawEditor(ctx: CanvasRenderingContext2D, lines: CodeLines, shown: number, caret: boolean, mono: string) {
  const { w: W, h: H } = EDITOR_PX;
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, W, H);

  // Tabs
  ctx.fillStyle = C.chrome;
  ctx.fillRect(0, 0, W, 76);
  ctx.fillStyle = C.bg;
  ctx.fillRect(0, 0, 250, 76);
  ctx.fillStyle = C.accent;
  ctx.fillRect(0, 0, 250, 3);
  ctx.font = `500 24px ${mono}`;
  ctx.textBaseline = 'middle';
  ctx.fillStyle = C.text;
  ctx.fillText('amin.tsx', 40, 40);
  ctx.fillStyle = C.muted;
  ctx.fillText('cv.ts', 290, 40);
  ctx.fillText('skills.json', 420, 40);

  // Status bar
  ctx.fillStyle = C.chrome;
  ctx.fillRect(0, H - 50, W, 50);
  ctx.font = `400 21px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('main', 40, H - 25);
  ctx.textAlign = 'right';
  ctx.fillText('TypeScript React', W - 40, H - 25);
  ctx.textAlign = 'left';

  // Code
  const top = 128, lh = 52, gutter = 92, x0 = 124;
  ctx.font = `400 27px ${mono}`;
  const cw = ctx.measureText('M').width;
  let left = shown, cx = x0, cy = top, done = false;
  for (let i = 0; i < lines.length && !done; i++) {
    const y = top + i * lh;
    ctx.textAlign = 'right';
    ctx.fillStyle = C.faint;
    ctx.fillText(String(i + 1), gutter, y);
    ctx.textAlign = 'left';
    let x = x0;
    for (const [kind, text] of lines[i]) {
      const take = Math.min(text.length, left);
      if (take > 0) {
        ctx.fillStyle = SX[kind];
        ctx.fillText(text.slice(0, take), x, y);
      }
      x += take * cw;
      left -= take;
      if (take < text.length) { done = true; break; }
    }
    cx = x; cy = y;
    if (!done) {
      if (left <= 0) done = true;
      else left -= 1;
    }
  }
  if (caret) {
    ctx.fillStyle = C.accent;
    ctx.fillRect(cx + 2, cy - 17, 3, 34);
  }
}

export function drawTree(ctx: CanvasRenderingContext2D, files: string[], active: string, mono: string) {
  const { w: W, h: H } = TREE_PX;
  ctx.fillStyle = '#0d0f13';
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.font = `600 20px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('EXPLORER', 36, 56);
  ctx.font = `500 24px ${mono}`;
  ctx.fillStyle = C.text;
  ctx.fillText('v  portfolio', 36, 124);
  const all = [active, ...files];
  all.forEach((f, k) => {
    const y = 192 + k * 64;
    if (f === active) {
      ctx.fillStyle = C.accentSoft;
      ctx.fillRect(0, y - 30, W, 60);
      ctx.fillStyle = C.accent;
      ctx.fillRect(0, y - 30, 4, 60);
    }
    ctx.fillStyle = f.endsWith('/') ? C.muted : f.endsWith('.tsx') ? C.accent : f.endsWith('.json') ? '#e2c07a' : '#9aa0ab';
    ctx.fillRect(70, y - 8, 16, 16);
    ctx.fillStyle = f === active ? '#ffffff' : C.text;
    ctx.fillText(f, 104, y);
  });
}

export function drawSuggest(ctx: CanvasRenderingContext2D, items: [label: string, detail: string][], selected: number, mono: string) {
  const { w: W, h: H } = SUGGEST_PX;
  ctx.fillStyle = '#15181e';
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 3;
  ctx.strokeRect(1.5, 1.5, W - 3, H - 3);
  ctx.textBaseline = 'middle';
  const rh = (H - 24) / items.length;
  items.forEach(([label, detail], k) => {
    const y = 12 + k * rh;
    if (k === selected) {
      ctx.fillStyle = C.accentSoft;
      ctx.fillRect(10, y + 4, W - 20, rh - 8);
    }
    ctx.fillStyle = k === selected ? C.accent : '#2a2f3a';
    ctx.fillRect(34, y + rh / 2 - 16, 32, 32);
    ctx.font = `600 20px ${mono}`;
    ctx.fillStyle = k === selected ? '#0c0d10' : C.muted;
    ctx.textAlign = 'center';
    ctx.fillText(label[0], 50, y + rh / 2 + 1);
    ctx.textAlign = 'left';
    ctx.font = `500 26px ${mono}`;
    ctx.fillStyle = k === selected ? '#ffffff' : C.text;
    ctx.fillText(label, 90, y + rh / 2);
    ctx.font = `400 21px ${mono}`;
    ctx.fillStyle = C.muted;
    ctx.textAlign = 'right';
    ctx.fillText(detail, W - 34, y + rh / 2);
    ctx.textAlign = 'left';
  });
}

export function drawTerminal(ctx: CanvasRenderingContext2D, built: boolean, mono: string) {
  const { w: W, h: H } = TERM_PX;
  ctx.fillStyle = C.chrome;
  ctx.fillRect(0, 0, W, H);
  ctx.textBaseline = 'middle';
  ctx.font = `600 19px ${mono}`;
  ctx.fillStyle = C.muted;
  ctx.fillText('TERMINAL', 36, 44);
  ctx.fillStyle = C.line;
  ctx.fillRect(0, 80, W, 2);
  ctx.font = `400 26px ${mono}`;
  ctx.fillStyle = C.ok;
  ctx.fillText('$', 36, 130);
  ctx.fillStyle = C.text;
  ctx.fillText('npm run build', 70, 130);
  if (built) {
    ctx.fillStyle = C.ok;
    ctx.fillText('ready', 36, 190);
    ctx.fillStyle = C.muted;
    ctx.fillText('compiled with 0 errors', 130, 190);
  }
}
