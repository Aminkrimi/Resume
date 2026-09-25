'use client';

import { useEffect, useState } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { on } from '@/lib/client';
import type { SourceKind } from '@/lib/source';
import type { CodeLines } from './editorArt';
import { CopyCode } from './CopyCode';
import { Icon } from './Icon';

/**
 * The code behind a section, shown in source view. Hidden until someone presses S, so it is not
 * part of the HTML: the code is generated in the browser once the page is idle (or right away
 * when source view is switched on). That keeps about half of the DOM out of the first render.
 */
export function SourceView({ file, kind, lang }: { file: string; kind: SourceKind; lang: Lang }) {
  const [lines, setLines] = useState<CodeLines | null>(null);
  const [text, setText] = useState('');

  useEffect(() => {
    let live = true, done = false;
    const load = () => {
      if (done) return;
      done = true;
      import('@/lib/source').then((m) => {
        if (!live) return;
        const l = m.SOURCES[kind](makeI18n(lang));
        setLines(l);
        setText(m.plain(l));
      });
    };
    const off = on('source', load);
    const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(load, { timeout: 5000 }) : setTimeout(load, 2000));
    if (document.readyState === 'complete') idle(); else addEventListener('load', idle, { once: true });
    return () => { live = false; off(); removeEventListener('load', idle); };
  }, [kind, lang]);

  const i = makeI18n(lang);
  return (
    <div className="src-view" dir="ltr">
      <div className="src-bar">
        <span className="src-file"><Icon name="braces" />{file}</span>
        <span className="src-meta">{lines ? `${lines.length} lines` : '...'}</span>
        <CopyCode text={text} label={i.t(cv.ui.copyCode)} done={i.t(cv.ui.codeCopied)} />
      </div>
      <pre className="src-code"><code>
        {lines?.map((l, k) => (
          <span className="ln" key={k}>{l.length ? l.map(([c, t], j) => <span className={`sx-${c}`} key={j}>{t}</span>) : ' '}</span>
        ))}
      </code></pre>
    </div>
  );
}
