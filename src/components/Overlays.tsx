'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { copyText, emit, jumpSection, on, prefersReduced, switchLang, toggleSource, toggleTheme } from '@/lib/client';
import { Icon } from './Icon';
import { Inspector } from './Inspector';
import dynamic from 'next/dynamic';

// Loaded on first use: most visitors never open them, so they stay out of the initial bundle.
const Palette = dynamic(() => import('./Palette').then((m) => m.Palette), { ssr: false });
const Terminal = dynamic(() => import('./Terminal').then((m) => m.Terminal), { ssr: false });

/** Owns the command palette, terminal, toast and global keyboard shortcuts. */
export function Overlays({ lang }: { lang: Lang }) {
  const i = makeI18n(lang);
  const [palette, setPalette] = useState(false);
  const [termLoaded, setTermLoaded] = useState(false);
  const [term, setTerm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inspectLabels = useMemo(() => ({
    on: i.t(cv.ui.inspectOn), off: i.t(cv.ui.inspectOff), copied: i.t(cv.ui.selectorCopied), mouse: i.t(cv.ui.needsMouse),
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [lang]);

  // Event bus from buttons elsewhere on the page
  useEffect(() => {
    const showToast = (msg: string) => {
      setToast(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    };
    const offs = [
      on('terminal', () => { setPalette(false); setTermLoaded(true); setTerm(true); }),
      on('palette', () => { setTerm(false); setPalette((v) => !v); }),
      on('print', () => window.print()),
      on('copy-email', async () => { await copyText(cv.person.email); showToast(i.t(cv.ui.copied)); }),
      on('toast', (m) => m && showToast(m)),
      on('source', () => showToast(i.t(toggleSource() ? cv.ui.sourceOn : cv.ui.sourceOff))),
    ];
    return () => offs.forEach((off) => off());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Global keyboard shortcuts
  useEffect(() => {
    let lastG = 0;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setTerm(false); setPalette((v) => !v); return; }
      if (palette || term) return;
      if ((e.target as Element).closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === '`' || k === '~') { e.preventDefault(); setTermLoaded(true); setTerm(true); }
      else if (k === 't') toggleTheme();
      else if (k === 's') emit('source');
      else if (k === 'i') emit('inspect');
      else if (k === 'l') switchLang(lang);
      else if (k === '/') { e.preventDefault(); setPalette(true); }
      // Vim motions: j / k between sections, gg to the top, G to the bottom.
      else if (k === 'j' || k === 'k') jumpSection(k === 'j' ? 1 : -1);
      else if (e.key === 'G') scrollTo({ top: document.documentElement.scrollHeight, behavior: prefersReduced() ? 'auto' : 'smooth' });
      else if (e.key === 'g') {
        if (performance.now() - lastG < 450) { scrollTo({ top: 0, behavior: prefersReduced() ? 'auto' : 'smooth' }); lastG = 0; }
        else lastG = performance.now();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [palette, term, lang]);

  useEffect(() => {
    console.log('%cAK %cMohammad Amin Karimi. Try ⌘K, S, I, T, L, or ` for the terminal.', 'color:#4a6fdc;font-weight:bold', 'color:inherit');
  }, []);

  return (
    <>
      {palette && <Palette lang={lang} onClose={() => setPalette(false)} />}
      <Inspector labels={inspectLabels} />
      {termLoaded && <Terminal lang={lang} open={term} onClose={() => setTerm(false)} />}
      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast && <><Icon name="check" /> {toast}</>}
      </div>
      <noscript>{i.L('برای تجربهٔ کامل جاوااسکریپت را فعال کنید.', 'Enable JavaScript for the full experience.')}</noscript>
    </>
  );
}
