'use client';

import { useEffect } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { prefersReduced } from '@/lib/client';
import { SECTIONS } from './SectionHead';

/**
 * Page-wide DOM effects that don't need React state: scroll reveals, counters,
 * active nav link, progress bar, auto-hiding top bar, timeline fill, card
 * spotlight and the live Tehran clock.
 */
export function Effects({ lang }: { lang: Lang }) {
  useEffect(() => {
    const { num } = makeI18n(lang);
    const reduced = prefersReduced();
    const $$ = <E extends Element>(s: string) => [...document.querySelectorAll<E>(s)];
    const cleanups: (() => void)[] = [];

    // Counters
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count);
      if (reduced) return;
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / 1400);
        el.textContent = num(Math.round(target * (1 - Math.pow(1 - k, 4))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // Reveal on scroll
    const revealIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add('in');
        e.target.querySelectorAll<HTMLElement>('[data-count]').forEach(countUp);
        revealIO.unobserve(e.target);
      }
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    $$('.reveal, .job, .project').forEach((el) => revealIO.observe(el));
    cleanups.push(() => revealIO.disconnect());

    // Active nav link
    const navIO = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        $$<HTMLAnchorElement>('[data-nav]').forEach((a) => a.classList.toggle('active', a.dataset.nav === e.target.id));
      }
    }, { rootMargin: '-45% 0px -50% 0px' });
    SECTIONS.forEach((id) => { const s = document.getElementById(id); if (s) navIO.observe(s); });
    cleanups.push(() => navIO.disconnect());

    // Scroll-driven bits
    const bar = document.querySelector<HTMLElement>('.progress span');
    const top = document.querySelector('.topbar');
    const tl = document.getElementById('timeline');
    let lastY = 0, raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
        if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
        top?.classList.toggle('hide', y > 500 && y > lastY);
        lastY = y;
        if (tl) {
          const r = tl.getBoundingClientRect();
          tl.style.setProperty('--tl', String(Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height))));
        }
      });
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    cleanups.push(() => removeEventListener('scroll', onScroll));

    // Card spotlight follows the pointer
    if (matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced) {
      const move = (e: PointerEvent) => {
        const card = (e.target as Element).closest<HTMLElement>('.card');
        if (!card) return;
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - r.left}px`);
        card.style.setProperty('--my', `${e.clientY - r.top}px`);
      };
      addEventListener('pointermove', move, { passive: true });
      cleanups.push(() => removeEventListener('pointermove', move));
    }

    // Live clock
    const fmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: cv.person.timezone,
    });
    const tick = () => { const now = fmt.format(new Date()); $$<HTMLElement>('[data-clock]').forEach((el) => { el.textContent = now; }); };
    tick();
    const clock = setInterval(tick, 1000);
    cleanups.push(() => clearInterval(clock));

    return () => cleanups.forEach((fn) => fn());
  }, [lang]);

  return null;
}
