'use client';

import { useEffect, useState } from 'react';
import { LH_LABELS, loadLighthouse, scoreBand, type LhSummary } from '@/lib/lighthouse';

const R = 15, C = 2 * Math.PI * R;

/** Lighthouse scores of this build, measured in CI on every deploy. Hidden when there are none. */
export function LighthouseScores({ title, note }: { title: string; note: string }) {
  const [lh, setLh] = useState<LhSummary | null>(null);
  useEffect(() => { loadLighthouse().then(setLh); }, []);
  if (!lh) return null;
  return (
    <div className="lh">
      <div className="lh-head">
        <span className="lh-title">{title}</span>
        <span className="lh-note">
          {note} {lh.sha && <a href={`https://github.com/Aminkrimi/Resume/commit/${lh.sha}`} target="_blank" rel="noopener">{lh.sha.slice(0, 7)}</a>}
        </span>
      </div>
      <ul className="lh-scores" dir="ltr">
        {LH_LABELS.map(([k, label]) => {
          const v = lh.scores[k];
          return (
            <li key={k} className={`lh-${scoreBand(v)}`}>
              <svg viewBox="0 0 36 36" aria-hidden="true">
                <circle cx="18" cy="18" r={R} className="track" />
                <circle cx="18" cy="18" r={R} className="arc" strokeDasharray={`${(v / 100) * C} ${C}`} />
              </svg>
              <b className="tnum">{v}</b>
              <span>{label}</span>
            </li>
          );
        })}
      </ul>
      <p className="lh-metrics" dir="ltr">
        {(['fcp', 'lcp', 'tbt', 'cls'] as const).map((m) => <span key={m}>{m.toUpperCase()} <b>{lh.metrics[m].display}</b></span>)}
      </p>
    </div>
  );
}
