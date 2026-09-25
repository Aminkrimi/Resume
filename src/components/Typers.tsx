'use client';

import { useEffect, useState } from 'react';
import { prefersReduced } from '@/lib/client';

/** Types, holds, deletes and cycles through a list of roles. */
export function RoleTyper({ roles }: { roles: string[] }) {
  const [text, setText] = useState('');
  useEffect(() => {
    let r = 0, c = 0, del = false, timer: ReturnType<typeof setTimeout>;
    if (prefersReduced()) { timer = setTimeout(() => setText(roles[0]), 0); return () => clearTimeout(timer); }
    const tick = () => {
      const word = roles[r];
      c += del ? -1 : 1;
      setText(word.slice(0, c));
      let wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 700);
    return () => clearTimeout(timer);
  }, [roles]);
  return <span aria-live="off">{text}</span>;
}

type Token = [cls: 'k' | 's' | 'f' | 'n' | 'c' | 'p' | 'u' | 'b', text: string];

/** Syntax-highlighted code that "types itself" once, with a blinking caret. */
export function CodeTyper({ lines }: { lines: Token[][] }) {
  const total = lines.reduce((a, l) => a + l.reduce((b, [, s]) => b + [...s].length, 0) + 1, 0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    let n = 0, timer: ReturnType<typeof setTimeout>;
    if (prefersReduced()) { timer = setTimeout(() => setShown(total), 0); return () => clearTimeout(timer); }
    const step = () => {
      n = Math.min(total, n + 2);
      setShown(n);
      if (n < total) timer = setTimeout(step, 16);
    };
    timer = setTimeout(step, 600);
    return () => clearTimeout(timer);
  }, [total]);

  let left = shown;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < lines.length; i++) {
    const parts: React.ReactNode[] = [];
    let stop = false;
    for (const [k, [cls, text]] of lines[i].entries()) {
      const chars = [...text];
      const take = Math.min(chars.length, left);
      if (take > 0) parts.push(<span key={k} className={`sx-${cls}`}>{chars.slice(0, take).join('')}</span>);
      left -= take;
      if (take < chars.length) { stop = true; break; }
    }
    const typing = shown < total;
    if (!stop && left <= 0 && typing) stop = true;
    out.push(
      <span className="ln" data-n={i + 1} key={i}>
        {parts.length ? parts : ' '}
        {stop && typing && <span className="type-caret" />}
      </span>,
    );
    if (stop) break;
    left -= 1;
  }
  return <code>{out}</code>;
}
