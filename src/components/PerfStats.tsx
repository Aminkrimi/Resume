'use client';

import { useSyncExternalStore } from 'react';
import { fmtVitals, getServerVitals, getVitals, goodVitals, subscribeVitals } from '@/lib/vitals';

/** Live Web Vitals of this very visit, measured in the visitor's browser. */
export function PerfStats({ title }: { title: string }) {
  const v = useSyncExternalStore(subscribeVitals, getVitals, getServerVitals);
  const f = fmtVitals(v), good = goodVitals(v);
  const items = [
    { k: 'LCP', v: f.lcp, ok: good.lcp },
    { k: 'CLS', v: f.cls, ok: good.cls },
    { k: 'INP', v: f.inp, ok: good.inp },
    { k: 'Weight', v: f.kb, ok: false },
  ];
  return (
    <div className="perf" dir="ltr">
      <span className="perf-title">{title}</span>
      <dl>
        {items.map((x) => <div key={x.k}><dt>{x.k}</dt><dd className={x.ok ? 'good' : undefined}>{x.v}</dd></div>)}
      </dl>
    </div>
  );
}
