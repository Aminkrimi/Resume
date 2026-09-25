'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { switchLang, toggleTheme } from '@/lib/client';
import { FILES } from './SectionHead';

type Line = { id: number; node: ReactNode; fa?: boolean };

const C = ({ c, children }: { c: string; children: ReactNode }) => <span className={`t-${c}`}>{children}</span>;
const Prompt = () => <><C c="p">amin@karimi</C><C c="m">:</C><C c="d">~</C><C c="m">$</C></>;
const ext = { target: '_blank', rel: 'noopener' } as const;
const HASHES = ['a3f9c21', '7be04d9', '4c2e81f', '19d7a3b', 'e5b6f02'];

/** A small interactive shell: help, whoami, skills, projects, open <id>, contact, … */
export function Terminal({ lang, open, onClose }: { lang: Lang; open: boolean; onClose: () => void }) {
  const i = makeI18n(lang);
  const [lines, setLines] = useState<Line[]>([]);
  const [value, setValue] = useState('');
  const history = useRef<string[]>([]);
  const hpos = useRef(0);
  const nextId = useRef(0);
  const input = useRef<HTMLInputElement>(null);
  const body = useRef<HTMLDivElement>(null);

  const print = (node: ReactNode, fa = false) => setLines((ls) => [...ls, { id: nextId.current++, node, fa }]);
  const printFa = (node: ReactNode) => print(node, lang === 'fa');

  useEffect(() => {
    if (!open) return;
    if (nextId.current === 0) {
      print(<><C c="d">amin-karimi</C> <C c="m">v{new Date().getFullYear() - cv.person.startYear}.0.0, {new Date().toDateString()}</C></>);
      printFa(<>{i.L('خوش اومدی! برای دیدن فرمان‌ها ', 'Welcome! Type ')}<C c="a">help</C>{i.L(' رو تایپ کن.', ' to see what you can do.')}</>);
    }
    const t = setTimeout(() => input.current?.focus(), 20);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight }); }, [lines]);

  const COMMANDS: Record<string, (...args: string[]) => void> = {
    help: () => print(<>
      <C c="y">{i.L('فرمان‌های موجود', 'Available commands')}:</C>{'\n'}
      {([
        ['whoami', 'من کی هستم', 'who am I'], ['about', 'درباره من', 'short bio'], ['skills', 'مهارت‌ها', 'tech stack'],
        ['experience', 'سوابق کاری', 'work history (git log)'], ['projects', 'نمونه‌کارها', 'list projects'],
        ['open <id>', 'باز کردن پروژه', 'open a project'], ['contact', 'راه‌های ارتباط', 'how to reach me'],
        ['theme', 'تغییر تم', 'toggle theme'], ['lang', 'تغییر زبان', 'switch language'], ['cv', 'دانلود رزومه', 'print / save CV'],
        ['clear', 'پاک کردن صفحه', 'clear screen'], ['exit', 'بستن ترمینال', 'close terminal'],
      ] as const).map(([c, fa, en]) => <span key={c}>{'  '}<C c="a">{c.padEnd(12)}</C>{i.L(fa, en)}{'\n'}</span>)}
    </>),
    whoami: () => print(<><C c="w">{cv.person.name.en}</C>, {cv.person.role.en} <C c="m">@ {cv.person.location.en}</C></>),
    about: () => cv.about.paragraphs.forEach((x) => printFa(i.t(x))),
    skills: () => cv.skills.forEach((g) => {
      print(<C c="y">▸ {g.group.en}</C>);
      g.items.forEach((s) => print(<>{'  '}{s.name.padEnd(24)} <C c="d">{'█'.repeat(s.level)}</C><C c="m">{'░'.repeat(5 - s.level)}</C></>));
    }),
    experience: () => cv.experience.forEach((j, k) => {
      print(<><C c="y">commit {HASHES[k % HASHES.length]}</C>{k === 0 && <> <C c="a">(HEAD → main)</C></>}</>);
      printFa(<><C c="w">{i.t(j.title)}</C>, {i.t(j.org)} <C c="m">[{i.t(j.period)}]</C></>);
    }),
    projects: () => {
      cv.projects.forEach((p) => print(<>{'  '}<C c="a">{p.id.padEnd(13)}</C> {p.title.en} <C c="m">{p.stack.join(', ')}</C></>));
      print(<C c="m">{i.L('برای باز کردن: open <id>', 'Try: open <id>')}</C>);
    },
    open: (arg = '') => {
      const p = cv.projects.find((x) => x.id === arg);
      if (!p) return print(<><C c="e">{i.L('پروژه پیدا نشد', 'project not found')}:</C> {arg}</>);
      const url = (p.url ?? p.code)!;
      print(<>{i.L('در حال باز کردن', 'opening')} <a href={url} {...ext}>{url}</a> …</>);
      window.open(url, '_blank', 'noopener');
    },
    contact: () => cv.person.social.forEach((s) => print(<>{'  '}{s.label.padEnd(10)} <a href={s.url} {...ext}>{s.handle}</a></>)),
    theme: () => { toggleTheme(); print(<><C c="p">✓</C> theme → {document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'}</>); },
    lang: () => switchLang(lang),
    cv: () => { onClose(); setTimeout(() => window.print(), 100); },
    clear: () => setLines([]),
    exit: () => onClose(),
    date: () => print(new Date().toString()),
    ls: () => print(Object.values(FILES).map((f) => <span key={f}><C c={f.endsWith('/') ? 'd' : 'w'}>{f}</C>{'  '}</span>)),
    sudo: () => print(<><C c="e">{i.L('دسترسی رد شد. ولی می‌تونی منو استخدام کنی:', 'Permission denied. You can hire me instead:')}</C> <a href={`mailto:${cv.person.email}`}>{cv.person.email}</a></>),
    echo: (...a) => print(a.join(' ')),
  };
  const ALIASES: Record<string, string> = { exp: 'experience', work: 'projects', cat: 'about', '?': 'help', 'hire-me': 'sudo' };

  const run = (raw: string) => {
    const line = raw.trim();
    print(<><Prompt /> <C c="w">{line}</C></>);
    if (!line) return;
    history.current.push(line);
    hpos.current = history.current.length;
    const [cmd0, ...args] = line.split(/\s+/);
    const cmd = ALIASES[cmd0.toLowerCase()] ?? cmd0.toLowerCase();
    const fn = COMMANDS[cmd];
    if (fn) fn(...args);
    else print(<><C c="e">command not found:</C> {cmd0}. {i.L('برای راهنما help را تایپ کن', 'type')} <C c="a">help</C></>);
  };

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    const h = history.current;
    if (e.key === 'Enter') { run(value); setValue(''); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (hpos.current > 0) setValue(h[--hpos.current]); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); hpos.current = Math.min(h.length, hpos.current + 1); setValue(h[hpos.current] ?? ''); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const [c, a] = value.toLowerCase().split(/\s+/);
      if (c === 'open' && a !== undefined) { const m = cv.projects.find((p) => p.id.startsWith(a)); if (m) setValue(`open ${m.id}`); }
      else { const m = Object.keys(COMMANDS).find((k) => k.startsWith(c)); if (m) setValue(m); }
    }
    else if (e.key === 'Escape') onClose();
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  if (!open) return null;
  return (
    <div className="term" role="dialog" aria-modal="true" aria-label="Terminal"
      onClick={(e) => { if (!(e.target as Element).closest('a') && !getSelection()?.toString()) input.current?.focus(); }}>
      <div className="term-backdrop" onClick={onClose} />
      <div className="term-win">
        <div className="term-bar">
          <span className="title">amin@karimi: ~</span>
          <button type="button" onClick={onClose} aria-label="Close">esc</button>
        </div>
        <div className="term-body" ref={body}>
          {lines.map((l) => <div key={l.id} className={`out${l.fa ? ' fa' : ''}`}>{l.node}</div>)}
          <label className="term-row">
            <Prompt />
            <input ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
              type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} aria-label="Terminal input" />
          </label>
        </div>
      </div>
    </div>
  );
}
