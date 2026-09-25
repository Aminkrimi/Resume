'use client';

import { useEffect, useRef } from 'react';
import { copyText, emit, on } from '@/lib/client';

type Labels = { on: string; off: string; copied: string; mouse: string };

/** Short CSS selector for an element: tag#id.class.class */
const selectorOf = (el: Element) =>
  el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '') + [...el.classList].filter((c) => !/^(in|reveal|rise)$/.test(c)).slice(0, 2).map((c) => `.${c}`).join('');

/**
 * DevTools-style inspect mode: hover outlines any element with its selector and size, click copies
 * the selector. Toggled by the I key, the palette or the terminal. Pointer moves only touch the
 * overlay's styles, never React state.
 */
export function Inspector({ labels }: { labels: Labels }) {
  const box = useRef<HTMLDivElement>(null);
  const tag = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = false;
    let current: Element | null = null;

    const place = (el: Element) => {
      const b = box.current, t = tag.current;
      if (!b || !t) return;
      const r = el.getBoundingClientRect();
      b.style.transform = `translate(${r.left}px, ${r.top}px)`;
      b.style.width = `${r.width}px`;
      b.style.height = `${r.height}px`;
      t.querySelector('b')!.textContent = selectorOf(el);
      t.querySelector('span')!.textContent = `${Math.round(r.width)} × ${Math.round(r.height)}`;
      const below = r.top < 40;
      t.style.transform = `translate(${Math.max(8, Math.min(r.left, innerWidth - 260))}px, ${below ? r.bottom + 6 : r.top - 30}px)`;
    };
    const move = (e: PointerEvent) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      if (!el || el === document.documentElement || el === document.body || el.closest('.inspector')) return;
      current = el;
      place(el);
    };
    // Wheel (not scroll) keeps the outline glued to the element while the page moves.
    const refresh = () => requestAnimationFrame(() => { if (current) place(current); });
    const click = (e: MouseEvent) => {
      if (!current) return;
      e.preventDefault();
      e.stopPropagation();
      copyText(selectorOf(current)).then(() => emit('toast', `${labels.copied}: ${selectorOf(current!)}`));
    };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setActive(false); };

    function setActive(v: boolean) {
      if (v === active) return;
      if (v && !matchMedia('(pointer: fine)').matches) { emit('toast', labels.mouse); return; }
      active = v;
      document.documentElement.toggleAttribute('data-inspect', v);
      const opts = { capture: true } as const;
      if (v) {
        addEventListener('pointermove', move, { passive: true });
        addEventListener('wheel', refresh, { passive: true });
        addEventListener('click', click, opts);
        addEventListener('keydown', key);
      } else {
        current = null;
        removeEventListener('pointermove', move);
        removeEventListener('wheel', refresh);
        removeEventListener('click', click, opts);
        removeEventListener('keydown', key);
      }
      emit('toast', v ? labels.on : labels.off);
    }

    const off = on('inspect', () => setActive(!active));
    return () => { off(); setActive(false); };
  }, [labels]);

  return (
    <div className="inspector" aria-hidden="true">
      <div className="inspect-box" ref={box} />
      <div className="inspect-tag" ref={tag}><b /><span /></div>
    </div>
  );
}
