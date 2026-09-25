'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { cv } from '@/data/cv';
import type { IconName, Lang, T } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { emit, switchLang, toggleTheme } from '@/lib/client';
import { Icon } from './Icon';
import { SECTIONS } from './SectionHead';

type Command = { label: string; kw: string; icon: IconName; key?: string; run: () => void };
const both = (o: T) => `${o.fa} ${o.en}`;

/** Mounted only while open, so its search state starts fresh every time. */
export function Palette({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const i = makeI18n(lang);
  const [q, setQ] = useState('');
  const [index, setIndex] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const P = cv.ui.palette;
  const smooth = () => (matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth') as ScrollBehavior;

  const commands = useMemo<Command[]>(() => [
    ...SECTIONS.map((id) => ({
      label: `${i.t(P.goto)} ${i.t(cv.ui.nav[id])}`, kw: `${both(P.goto)} ${both(cv.ui.nav[id])}`, icon: 'arrow' as const,
      run: () => document.getElementById(id)?.scrollIntoView({ behavior: smooth() }),
    })),
    { label: i.t(P.terminal), kw: `${both(P.terminal)} terminal shell`, icon: 'terminal', key: '`', run: () => emit('terminal') },
    { label: i.t(P.theme), kw: both(P.theme), icon: 'sun', key: 'T', run: () => toggleTheme() },
    { label: i.t(P.lang), kw: both(P.lang), icon: 'globe', key: 'L', run: () => switchLang(lang) },
    { label: i.t(P.email), kw: both(P.email), icon: 'copy', run: () => emit('copy-email') },
    { label: i.t(P.print), kw: `${both(P.print)} cv pdf`, icon: 'download', run: () => window.print() },
    { label: i.t(P.github), kw: both(P.github), icon: 'github', run: () => window.open('https://github.com/Aminkrimi', '_blank', 'noopener') },
    { label: i.t(P.telegram), kw: both(P.telegram), icon: 'telegram', run: () => window.open('https://t.me/AminKrimi', '_blank', 'noopener') },
    { label: i.t(P.top), kw: both(P.top), icon: 'up', run: () => scrollTo({ top: 0, behavior: smooth() }) },
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [lang]);

  const items = commands.filter((c) => !q || `${c.label} ${c.kw}`.toLowerCase().includes(q.trim().toLowerCase()));
  const sel = Math.min(index, Math.max(0, items.length - 1));

  useEffect(() => { input.current?.focus(); }, []);

  const runAt = (k: number) => { const c = items[k]; if (!c) return; onClose(); setTimeout(c.run, 60); };

  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
      <div className="palette-backdrop" onClick={onClose} />
      <div className="palette-box">
        <div className="palette-input">
          <Icon name="search" />
          <input ref={input} value={q} placeholder={i.t(P.placeholder)} autoComplete="off" spellCheck={false}
            onChange={(e) => { setQ(e.target.value); setIndex(0); }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((sel + 1) % Math.max(1, items.length)); }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((sel - 1 + items.length) % Math.max(1, items.length)); }
              else if (e.key === 'Enter') { e.preventDefault(); runAt(sel); }
              else if (e.key === 'Escape') onClose();
            }} />
          <kbd>esc</kbd>
        </div>
        <ul className="palette-list" role="listbox">
          {items.length ? items.map((c, k) => (
            <li key={c.label} role="option" aria-selected={k === sel} onPointerMove={() => setIndex(k)} onClick={() => runAt(k)}>
              <Icon name={c.icon} /><span>{c.label}</span>{c.key && <small>{c.key}</small>}
            </li>
          )) : <li className="empty">{i.t(P.empty)}</li>}
        </ul>
        <div className="palette-foot">{i.L('↑↓ انتخاب · ↵ اجرا · esc بستن', '↑↓ navigate · ↵ run · esc close')}</div>
      </div>
    </div>
  );
}
