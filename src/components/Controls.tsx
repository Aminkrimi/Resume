'use client';

import type { Lang } from '@/data/types';
import { emit, switchLang, toggleTheme } from '@/lib/client';
import { Icon } from './Icon';

export function Controls({ lang }: { lang: Lang }) {
  const fa = lang === 'fa';
  return (
    <div className="controls">
      <button className="ctrl ctrl-wide" type="button" aria-label={fa ? 'پالت فرمان' : 'Command palette'} title="⌘K" onClick={() => emit('palette')}>
        <Icon name="command" /><span className="ctrl-k">K</span>
      </button>
      <button className="ctrl" id="btn-src" type="button" aria-pressed="false" aria-label={fa ? 'نمای سورس' : 'Source view'} title="S" onClick={() => emit('source')}>
        <Icon name="braces" />
      </button>
      <button className="ctrl" type="button" aria-label={fa ? 'ترمینال' : 'Terminal'} title="`" onClick={() => emit('terminal')}>
        <Icon name="terminal" />
      </button>
      <button className="ctrl" id="btn-lang" type="button" onClick={() => switchLang(lang)} aria-label={fa ? 'Switch to English' : 'تغییر زبان به فارسی'}>
        <span>{fa ? 'EN' : 'فا'}</span>
      </button>
      <button className="ctrl" id="btn-theme" type="button" aria-label={fa ? 'تغییر تم' : 'Toggle theme'} onClick={(e) => toggleTheme(e.currentTarget)}>
        <Icon name="sun" className="i-sun" />
        <Icon name="moon" className="i-moon" />
      </button>
    </div>
  );
}
