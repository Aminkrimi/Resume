'use client';

import { asset } from './i18n';

/** Summary written by scripts/lighthouse.mjs during the deploy workflow. */
export type LhSummary = {
  at: string;
  sha: string | null;
  lighthouse: string;
  device: string;
  scores: { performance: number; accessibility: number; bestPractices: number; seo: number };
  metrics: Record<'fcp' | 'lcp' | 'tbt' | 'cls' | 'si', { value: number | null; display: string }>;
};

let cached: Promise<LhSummary | null> | null = null;
/** Resolves to null when the file is missing (local dev, or Lighthouse failed in CI). */
export const loadLighthouse = () =>
  (cached ??= fetch(asset('/lighthouse.json')).then((r) => (r.ok ? (r.json() as Promise<LhSummary>) : null)).catch(() => null));

export const LH_LABELS: [keyof LhSummary['scores'], string][] = [
  ['performance', 'Performance'], ['accessibility', 'Accessibility'], ['bestPractices', 'Best practices'], ['seo', 'SEO'],
];
export const scoreBand = (n: number) => (n >= 90 ? 'good' : n >= 50 ? 'fair' : 'poor');
