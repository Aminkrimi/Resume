'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { on } from '@/lib/client';

/** Project stacks use a few spellings for the same thing. */
const SAME: Record<string, string> = { 'React 19': 'React', 'ASP.NET MVC': 'ASP.NET', REST: 'REST API' };
export const normTech = (s: string) => SAME[s] ?? s;

type Sel = { kind: 'tech' | 'project'; id: string } | null;
type Edge = { tech: string; project: string; d: string };

/**
 * Dependency graph: every technology wired to the projects that use it, straight from cv.ts.
 * Nodes are buttons (hover, focus or click to trace the links); edges are measured from the DOM.
 */
export function StackGraph({ lang, title, lead }: { lang: Lang; title: string; lead: string }) {
  const { techs, projects } = useMemo(() => {
    const uses = new Map<string, string[]>();
    cv.projects.forEach((p) => [...new Set(p.stack.map(normTech))].forEach((t) => uses.set(t, [...(uses.get(t) ?? []), p.id])));
    // Order technologies by the average position of their projects (barycentre) so edges run
    // mostly straight across instead of crossing; most-used first on ties.
    const order = new Map(cv.projects.map((p, k) => [p.id, k]));
    const centre = (ids: string[]) => ids.reduce((a, id) => a + order.get(id)!, 0) / ids.length;
    const techs = [...uses.entries()]
      .sort((a, b) => centre(a[1]) - centre(b[1]) || b[1].length - a[1].length || a[0].localeCompare(b[0]))
      .map(([name, ids]) => ({ name, ids }));
    return { techs, projects: cv.projects.map((p) => ({ id: p.id, title: p.title[lang], techs: [...new Set(p.stack.map(normTech))] })) };
  }, [lang]);

  const box = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [hover, setHover] = useState<Sel>(null);
  const [pinned, setPinned] = useState<Sel>(null);
  const active = hover ?? pinned;

  const measure = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const base = el.getBoundingClientRect();
    const rtl = getComputedStyle(el).direction === 'rtl';
    const pos = (sel: string) => {
      const r = el.querySelector<HTMLElement>(sel)?.getBoundingClientRect();
      return r && { l: r.left - base.left, r: r.right - base.left, y: r.top - base.top + r.height / 2 };
    };
    const out: Edge[] = [];
    techs.forEach((t) => t.ids.forEach((pid) => {
      const a = pos(`[data-tech="${CSS.escape(t.name)}"]`), b = pos(`[data-project="${pid}"]`);
      if (!a || !b) return;
      const x1 = rtl ? a.l : a.r, x2 = rtl ? b.r : b.l, mx = (x1 + x2) / 2;
      out.push({ tech: t.name, project: pid, d: `M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}` });
    }));
    setEdges(out);
  }, [techs]);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (box.current) ro.observe(box.current);
    // The reveal transition tilts the whole block in 3D, and web fonts reflow the labels:
    // measure again once either settles.
    const wrap = box.current?.closest('.reveal');
    wrap?.addEventListener('transitionend', measure);
    document.fonts.ready.then(measure);
    return () => { ro.disconnect(); wrap?.removeEventListener('transitionend', measure); };
  }, [measure]);

  // The 3D editor's autocomplete (and anything else) can ask for a technology to be traced.
  useEffect(() => on('focus-skill', (name) => {
    if (!name) return;
    const id = normTech(name);
    if (!techs.some((t) => t.name === id)) return;
    setPinned({ kind: 'tech', id });
    box.current?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
  }), [techs]);

  const litProject = (id: string) => !active || (active.kind === 'project' ? active.id === id : techs.find((t) => t.name === active.id)?.ids.includes(id));
  const litTech = (name: string) => !active || (active.kind === 'tech' ? active.id === name : projects.find((p) => p.id === active.id)?.techs.includes(name));
  const litEdge = (e: Edge) => !active || (active.kind === 'tech' ? e.tech === active.id : e.project === active.id);
  const toggle = (s: NonNullable<Sel>) => setPinned((p) => (p && p.kind === s.kind && p.id === s.id ? null : s));
  const bind = (s: NonNullable<Sel>) => ({
    onPointerEnter: () => setHover(s), onPointerLeave: () => setHover(null),
    onFocus: () => setHover(s), onBlur: () => setHover(null), onClick: () => toggle(s),
    'aria-pressed': !!pinned && pinned.kind === s.kind && pinned.id === s.id,
  });

  return (
    <div className="graph-wrap reveal">
      <h3 className="graph-title">{title}</h3>
      <p className="graph-lead">{lead}</p>
      <div className="graph" ref={box} data-active={active ? '' : undefined}>
        <svg className="graph-edges" aria-hidden="true">
          {edges.map((e) => <path key={`${e.tech}>${e.project}`} d={e.d} className={litEdge(e) ? 'on' : undefined} />)}
        </svg>
        <ul className="graph-col graph-techs">
          {techs.map((t) => (
            <li key={t.name}>
              <button type="button" className={`node tech${litTech(t.name) ? ' on' : ''}`} data-tech={t.name} {...bind({ kind: 'tech', id: t.name })}>
                <span>{t.name}</span><b className="tnum">{t.ids.length}</b>
              </button>
            </li>
          ))}
        </ul>
        <ul className="graph-col graph-projects">
          {projects.map((p) => (
            <li key={p.id}>
              <button type="button" className={`node project${litProject(p.id) ? ' on' : ''}`} data-project={p.id} {...bind({ kind: 'project', id: p.id })}>
                <span>{p.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
