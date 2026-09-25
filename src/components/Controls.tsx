'use client';

import type { Lang } from '@/data/types';
import { emit, switchLang, toggleTheme } from '@/lib/client';
import { Icon } from './Icon';

export function Controls({ lang }: { lang: Lang }) {
  return (
    <div className="controls">
      <button className="ctrl" id="btn-cmd" type="button" aria-label="Command palette" title="⌘K" onClick={() => emit('palette')}>
        <Icon name="command" /><kbd>K</kbd>
      </button>
      <button className="ctrl" type="button" aria-label="Terminal" title="`" onClick={() => emit('terminal')}>
        <Icon name="terminal" />
      </button>
      <button className="ctrl" id="btn-lang" type="button" onClick={() => switchLang(lang)} aria-label={lang === 'fa' ? 'Switch to English' : 'تغییر زبان به فارسی'}>
        <span>{lang === 'fa' ? 'EN' : 'FA'}</span>
      </button>
      <button className="ctrl" id="btn-theme" type="button" aria-label={lang === 'fa' ? 'تغییر تم' : 'Toggle theme'} onClick={(e) => toggleTheme(e.currentTarget)}>
        <Icon name="sun" className="i-sun" />
        <Icon name="moon" className="i-moon" />
      </button>
    </div>
  );
}
