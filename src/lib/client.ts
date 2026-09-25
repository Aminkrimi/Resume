'use client';

import type { Lang } from '@/data/types';
import { asset, langHref } from './i18n';

/** Tiny event bus so server-rendered buttons can talk to client overlays. */
export type CvEvent = 'terminal' | 'palette' | 'print' | 'copy-email' | 'toast';
export const emit = (name: CvEvent, detail?: string) => window.dispatchEvent(new CustomEvent(`cv:${name}`, { detail }));
export const on = (name: CvEvent, fn: (detail?: string) => void) => {
  const h = (e: Event) => fn((e as CustomEvent<string>).detail);
  window.addEventListener(`cv:${name}`, h);
  return () => window.removeEventListener(`cv:${name}`, h);
};

export const store = {
  get(k: string) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k: string, v: string) { try { localStorage.setItem(k, v); } catch { /* private mode */ } },
};

export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Theme switch with a circular reveal from the clicked element (View Transitions API). */
export function toggleTheme(origin?: Element | null) {
  const doc = document.documentElement;
  const next = doc.dataset.theme === 'dark' ? 'light' : 'dark';
  const apply = () => { doc.dataset.theme = next; store.set('cv-theme', next); };
  if (!document.startViewTransition || prefersReduced()) return apply();
  const r = (origin ?? document.getElementById('btn-theme'))?.getBoundingClientRect();
  const x = r ? r.left + r.width / 2 : innerWidth / 2;
  const y = r ? r.top + r.height / 2 : 0;
  const rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  document.startViewTransition(apply).ready.then(() => {
    doc.animate(
      { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${rad}px at ${x}px ${y}px)`] },
      { duration: 700, easing: 'cubic-bezier(.65,0,.35,1)', pseudoElement: '::view-transition-new(root)' },
    );
  });
}

/** Languages are separate static pages: / (fa) and /en/ (en). Keep the current section. */
export function switchLang(current: Lang) {
  const next: Lang = current === 'fa' ? 'en' : 'fa';
  store.set('cv-lang', next);
  window.location.assign(asset(langHref(next)) + window.location.hash);
}

export async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); }
  catch {
    const ta = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
}
