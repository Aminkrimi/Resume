'use client';

import { useEffect } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { prefersReduced } from '@/lib/client';
import { SECTIONS } from './SectionHead';

/**
 * Page-wide DOM effects that don't need React state: scroll reveals and the active nav link
 * (IntersectionObserver, no scroll listeners), 3D pointer tilt on screenshots and the live clock.
 */
export function Effects({ lang }: { lang: Lang }) {
  useEffect(() => {
    const $$ = <E extends Element>(s: string) => [...document.querySelectorAll<E>(s)];
    const cleanups: (() => void)[] = [];

    const revealIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        revealIO.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal').forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    const navIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        $$<HTMLAnchorElement>('[data-nav]').forEach((a) => {
          const on = a.dataset.nav === e.target.id;
          a.classList.toggle('active', on);
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
    cleanups.push(() => navIO.disconnect());

    // 3D tilt: CSS variables only, so React never re-renders on pointer moves.
    if (matchMedia('(hover: hover) and (pointer: fine)').matches && !prefersReduced()) {
      const move = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>('[data-tilt]');
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
        el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${((x + 0.5) * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${((y + 0.5) * 100).toFixed(1)}%`);
      };
      const leave = (e: PointerEvent) => {
        const el = (e.target as Element).closest<HTMLElement>('[data-tilt]');
        if (el && !el.contains(e.relatedTarget as Node)) { el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); }
      };
      addEventListener('pointermove', move, { passive: true });
      document.addEventListener('pointerout', leave, { passive: true });
      cleanups.push(() => { removeEventListener('pointermove', move); document.removeEventListener('pointerout', leave); });
    }

    const fmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', {
      hour: '2-digit', minute: '2-digit', hour12: false, timeZone: cv.person.timezone,
    });
    const tick = () => { const now = fmt.format(new Date()); $$<HTMLElement>('[data-clock]').forEach((el) => { el.textContent = now; }); };
    tick();
    const clock = setInterval(tick, 15000);
    cleanups.push(() => clearInterval(clock));

    return () => cleanups.forEach((fn) => fn());
  }, [lang]);

  return null;
}
