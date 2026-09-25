'use client';

/**
 * Real Web Vitals for the current visit (no library, no sampling): LCP, CLS, an INP-style
 * worst interaction, and the page weight actually downloaded. Observers start on first use.
 */
export type Vitals = { lcp?: number; cls: number; inp?: number; kb?: number };

let snap: Vitals = { cls: 0 };
let started = false;
const subs = new Set<() => void>();
const set = (patch: Partial<Vitals>) => { snap = { ...snap, ...patch }; subs.forEach((f) => f()); };

function observe(type: string, cb: (list: PerformanceObserverEntryList) => void, extra: Record<string, unknown> = {}) {
  try { new PerformanceObserver(cb).observe({ type, buffered: true, ...extra } as PerformanceObserverInit); } catch { /* unsupported */ }
}

function weigh() {
  const nav = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const bytes = [...nav, ...res].reduce((a, e) => a + (e.encodedBodySize || 0), 0);
  if (bytes) set({ kb: bytes / 1024 });
}

function start() {
  if (started || typeof PerformanceObserver === 'undefined') return;
  started = true;
  observe('largest-contentful-paint', (l) => { const e = l.getEntries().at(-1); if (e) set({ lcp: e.startTime }); });
  observe('layout-shift', (l) => {
    let add = 0;
    for (const e of l.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) if (!e.hadRecentInput) add += e.value;
    if (add) set({ cls: snap.cls + add });
  });
  observe('event', (l) => {
    for (const e of l.getEntries() as (PerformanceEntry & { interactionId?: number })[]) {
      if (e.interactionId && e.duration > (snap.inp ?? 0)) set({ inp: e.duration });
    }
  }, { durationThreshold: 16 });
  observe('resource', weigh);
  weigh();
}

export const subscribeVitals = (fn: () => void) => { subs.add(fn); start(); return () => { subs.delete(fn); }; };
export const getVitals = () => snap;
export const getServerVitals = (): Vitals => ({ cls: 0 });

export const fmtVitals = (v: Vitals) => ({
  lcp: v.lcp === undefined ? '...' : `${(v.lcp / 1000).toFixed(2)}s`,
  cls: v.cls.toFixed(3),
  inp: v.inp === undefined ? 'no input yet' : `${Math.round(v.inp)}ms`,
  kb: v.kb === undefined ? '...' : `${Math.round(v.kb)} kB`,
});
/** Google's "good" thresholds. */
export const goodVitals = (v: Vitals) => ({
  lcp: v.lcp !== undefined && v.lcp <= 2500,
  cls: v.cls <= 0.1,
  inp: v.inp !== undefined && v.inp <= 200,
});
