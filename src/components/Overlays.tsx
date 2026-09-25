'use client';

import { useEffect, useRef, useState } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { copyText, on, switchLang, toggleTheme } from '@/lib/client';
import { Icon } from './Icon';
import { Palette } from './Palette';
import { Terminal } from './Terminal';

/** Owns the command palette, terminal, toast and global keyboard shortcuts. */
export function Overlays({ lang }: { lang: Lang }) {
  const i = makeI18n(lang);
  const [palette, setPalette] = useState(false);
  const [term, setTerm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Event bus from buttons elsewhere on the page
  useEffect(() => {
    const showToast = (msg: string) => {
      setToast(msg);
      clearTimeout(toastTimer.current);
      toastTimer.current = setTimeout(() => setToast(null), 2200);
    };
    const offs = [
      on('terminal', () => { setPalette(false); setTerm(true); }),
      on('palette', () => { setTerm(false); setPalette((v) => !v); }),
      on('print', () => window.print()),
      on('copy-email', async () => { await copyText(cv.person.email); showToast(i.t(cv.ui.copied)); }),
      on('toast', (m) => m && showToast(m)),
    ];
    return () => offs.forEach((off) => off());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // Global keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setTerm(false); setPalette((v) => !v); return; }
      if (palette || term) return;
      if ((e.target as Element).closest('input, textarea, [contenteditable]') || e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === '`' || k === '~') { e.preventDefault(); setTerm(true); }
      else if (k === 't') toggleTheme();
      else if (k === 'l') switchLang(lang);
      else if (k === '/') { e.preventDefault(); setPalette(true); }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [palette, term, lang]);

  useEffect(() => {
    console.log('%cAK %cMohammad Amin Karimi. Try ⌘K, T, L, or ` for the terminal.', 'color:#4a6fdc;font-weight:bold', 'color:inherit');
  }, []);

  return (
    <>
      {palette && <Palette lang={lang} onClose={() => setPalette(false)} />}
      <Terminal lang={lang} open={term} onClose={() => setTerm(false)} />
      <div className={`toast${toast ? ' show' : ''}`} role="status" aria-live="polite">
        {toast && <><Icon name="check" /> {toast}</>}
      </div>
      <noscript>{i.L('برای تجربهٔ کامل جاوااسکریپت را فعال کنید.', 'Enable JavaScript for the full experience.')}</noscript>
    </>
  );
}
