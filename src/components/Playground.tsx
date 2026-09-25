'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cv } from '@/data/cv';
import { Icon } from './Icon';

export type PlayLabels = { run: string; console: string; idle: string; timeout: string; examples: [string, string, string, string] };

/** The page's own data, handed to the visitor's code as `amin`. */
const AMIN = {
  name: cv.person.name.en,
  role: cv.person.role.en,
  location: cv.person.location.en,
  email: cv.person.email,
  startYear: cv.person.startYear,
  available: cv.person.available,
  skills: cv.skills.flatMap((g) => g.items.map((s) => ({ group: g.group.en, name: s.name, level: s.level }))),
  projects: cv.projects.map((p) => ({ id: p.id, title: p.title.en, stack: p.stack, url: p.url ?? p.code })),
  experience: cv.experience.map((j) => ({ title: j.title.en, org: j.org.en, since: j.since, branch: j.branch })),
  links: Object.fromEntries(cv.person.social.map((s) => [s.label.toLowerCase(), s.url])),
};

const EXAMPLES = [
  `amin.skills\n  .filter((s) => s.level === 5)\n  .map((s) => s.name)`,
  `new Date().getFullYear() - amin.startYear`,
  `const count = {};\nfor (const p of amin.projects) {\n  for (const tech of p.stack) count[tech] = (count[tech] ?? 0) + 1;\n}\nconsole.log(count);\nreturn Object.entries(count).sort((a, b) => b[1] - a[1])[0];`,
  `amin.hire({ role: 'Senior Front-End Engineer' })`,
];

// Runs inside the worker: no DOM, no page state, killed if it takes longer than TIMEOUT.
const WORKER = `
const fmt = (v) => {
  if (typeof v === 'string') return JSON.stringify(v);
  if (typeof v === 'function') return 'ƒ ' + (v.name || 'anonymous') + '()';
  if (v === undefined) return 'undefined';
  try {
    const s = JSON.stringify(v, (k, x) => typeof x === 'bigint' ? x + 'n' : typeof x === 'function' ? 'ƒ ' + (x.name || 'anonymous') + '()' : x === undefined ? null : x, 2);
    return s === undefined ? String(v) : s.length > 4000 ? s.slice(0, 4000) + '\\n…' : s;
  } catch (e) { return String(v); }
};
self.onmessage = async ({ data: { code, amin } }) => {
  const logs = [];
  const out = (kind) => (...a) => logs.push({ kind, text: a.map((x) => typeof x === 'string' ? x : fmt(x)).join(' ') });
  const console = { log: out('log'), info: out('log'), table: out('log'), debug: out('log'), warn: out('warn'), error: out('error') };
  const me = { ...amin, hire: (o = {}) => 'Offer for "' + (o.role || 'a role') + '" noted. Send it to ' + amin.email + ' and expect a reply within a day.' };
  const t0 = performance.now();
  try {
    let fn;
    try { fn = new Function('amin', 'console', '"use strict"; return (async () => (\\n' + code.trim().replace(/;+\\s*$/, '') + '\\n))();'); }
    catch { fn = new Function('amin', 'console', '"use strict"; return (async () => {\\n' + code + '\\n})();'); }
    const value = await fn(me, console);
    self.postMessage({ ok: true, value: value === undefined ? null : fmt(value), logs, ms: performance.now() - t0 });
  } catch (err) {
    self.postMessage({ ok: false, error: (err && err.name ? err.name + ': ' : '') + (err && err.message || String(err)), logs, ms: performance.now() - t0 });
  }
};`;
const TIMEOUT = 1500;

type Line = { kind: 'log' | 'warn' | 'error' | 'result' | 'info'; text: string };

// Small JS highlighter for the editor overlay and the console.
const TOKENS = /(\/\/.*$)|('(?:\\.|[^'\\])*'?|"(?:\\.|[^"\\])*"?|`(?:\\.|[^`\\])*`?)|\b(const|let|var|return|function|async|await|new|if|else|for|of|in|typeof|true|false|null|undefined)\b|(=>)|\b(\d+(?:\.\d+)?)\b|(\.[A-Za-z_$][\w$]*)/gm;
function highlight(src: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0, k = 0;
  for (const m of src.matchAll(TOKENS)) {
    if (m.index > last) out.push(src.slice(last, m.index));
    const cls = m[1] ? 'c' : m[2] ? 's' : m[3] || m[4] ? 'k' : m[5] ? 'n' : 'f';
    out.push(<span key={k++} className={`sx-${cls}`}>{m[0]}</span>);
    last = m.index + m[0].length;
  }
  out.push(src.slice(last));
  return out;
}

export function Playground({ l }: { l: PlayLabels }) {
  const [code, setCode] = useState(EXAMPLES[0]);
  const [example, setExample] = useState(0);
  const [lines, setLines] = useState<Line[]>([]);
  const [busy, setBusy] = useState(false);
  const worker = useRef<Worker | null>(null);
  const url = useRef('');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const pre = useRef<HTMLPreElement>(null);
  const box = useRef<HTMLDivElement>(null);

  const spawn = useCallback(() => {
    worker.current?.terminate();
    url.current ||= URL.createObjectURL(new Blob([WORKER], { type: 'text/javascript' }));
    worker.current = new Worker(url.current);
  }, []);

  useEffect(() => {
    spawn();
    return () => { worker.current?.terminate(); clearTimeout(timer.current); if (url.current) URL.revokeObjectURL(url.current); };
  }, [spawn]);

  const run = useCallback((src: string) => {
    if (!worker.current) spawn();
    const w = worker.current!;
    setBusy(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      spawn();
      setBusy(false);
      setLines([{ kind: 'error', text: l.timeout }]);
    }, TIMEOUT);
    w.onmessage = ({ data }: MessageEvent<{ ok: boolean; value?: string | null; error?: string; logs: Line[]; ms: number }>) => {
      clearTimeout(timer.current);
      setBusy(false);
      setLines([
        ...data.logs,
        data.ok ? { kind: 'result', text: data.value ?? 'undefined' } : { kind: 'error', text: data.error ?? 'Error' },
        { kind: 'info', text: `${data.ms < 1 ? '<1' : data.ms.toFixed(1)} ms` },
      ]);
    };
    w.postMessage({ code: src, amin: AMIN });
  }, [l.timeout, spawn]);

  // Run the first example once the playground scrolls into view.
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); run(EXAMPLES[0]); } }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, [run]);

  const pick = (k: number) => { setExample(k); setCode(EXAMPLES[k]); run(EXAMPLES[k]); };
  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); run(code); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const t = e.currentTarget, s = t.selectionStart;
      const next = code.slice(0, s) + '  ' + code.slice(t.selectionEnd);
      setCode(next);
      requestAnimationFrame(() => { t.selectionStart = t.selectionEnd = s + 2; });
    }
  };
  const count = code.split('\n').length;
  const gutter = useMemo(() => Array.from({ length: count }, (_, k) => k + 1).join('\n'), [count]);

  return (
    <div className="play reveal" dir="ltr" ref={box}>
      <div className="play-bar">
        <span className="src-file"><Icon name="braces" />playground.ts</span>
        <div className="play-examples" role="tablist">
          {l.examples.map((x, k) => (
            <button key={x} type="button" role="tab" aria-selected={k === example} className="play-ex" onClick={() => pick(k)} dir="auto">{x}</button>
          ))}
        </div>
        <button type="button" className="play-run" onClick={() => run(code)} disabled={busy}>
          <Icon name="play" />{l.run}<kbd>⌘↵</kbd>
        </button>
      </div>
      <div className="play-body">
        <div className="play-editor">
          <pre className="play-gutter" aria-hidden="true">{gutter}</pre>
          <div className="play-code">
            <pre ref={pre} aria-hidden="true">{highlight(code)}{'\n'}</pre>
            <textarea value={code} spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label="Code"
              onChange={(e) => setCode(e.target.value)} onKeyDown={onKey}
              onScroll={(e) => { if (pre.current) { pre.current.scrollTop = e.currentTarget.scrollTop; pre.current.scrollLeft = e.currentTarget.scrollLeft; } }} />
          </div>
        </div>
        <div className="play-out" aria-live="polite">
          <div className="play-out-head">{l.console}{busy && <span className="play-busy" />}</div>
          {lines.length === 0 && <p className="play-idle" dir="auto">{l.idle}</p>}
          {lines.map((x, k) => (
            <pre key={k} className={`play-line ${x.kind}`}>{x.kind === 'result' ? <><span className="arrow">{'<- '}</span>{highlight(x.text)}</> : x.text}</pre>
          ))}
        </div>
      </div>
    </div>
  );
}
