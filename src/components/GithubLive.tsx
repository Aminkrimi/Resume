'use client';

import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/data/types';
import { GH_USER, loadGithub, timeAgo, type GhStats } from '@/lib/github';
import { Icon } from './Icon';

export type GhLabels = { title: string; commits: string; languages: string; repos: string; stars: string; error: string; empty: string; profile: string };

/**
 * Live GitHub card: the latest public commits as a git log, repo and star counts, language
 * shares and the contribution chart. Fetches once the card is near the viewport.
 */
export function GithubLive({ lang, l }: { lang: Lang; l: GhLabels }) {
  const ref = useRef<HTMLElement>(null);
  const [state, setState] = useState<{ status: 'idle' | 'loading' | 'ok' | 'error'; data?: GhStats }>({ status: 'idle' });
  const [chart, setChart] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      setState({ status: 'loading' });
      loadGithub().then((data) => setState({ status: 'ok', data }), () => setState({ status: 'error' }));
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const d = state.data;
  const loading = state.status === 'idle' || state.status === 'loading';

  return (
    <article className="cell cell-gh reveal" ref={ref} aria-busy={loading}>
      <div className="gh-head">
        <h3>{l.title}</h3>
        <a className="link" href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener"><Icon name="github" />{GH_USER}<Icon name="arrow" className="i-go" /></a>
      </div>

      <div className="gh-grid">
        <div className="gh-log" dir="ltr">
          <h4 dir="auto">{l.commits}</h4>
          {loading && <ol className="gh-commits">{[0, 1, 2, 3].map((k) => <li key={k} className="skel"><span /><span /></li>)}</ol>}
          {state.status === 'error' && <p className="gh-note" dir="auto">{l.error} <a href={`https://github.com/${GH_USER}`} target="_blank" rel="noopener">{l.profile}</a></p>}
          {d && !d.commits.length && <p className="gh-note" dir="auto">{l.empty}</p>}
          {d && d.commits.length > 0 && (
            <ol className="gh-commits">
              {d.commits.map((c) => (
                <li key={c.sha + c.repo}>
                  <a href={c.url} target="_blank" rel="noopener">
                    <span className="sha">{c.sha}</span>
                    <span className="msg">{c.message}</span>
                    <span className="meta"><b>{c.repo}</b> <time dateTime={c.date} dir="auto">{timeAgo(c.date, lang)}</time></span>
                  </a>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="gh-side">
          <dl className="gh-stats">
            <div><dt>{l.repos}</dt><dd className="tnum">{d ? d.repos : '...'}</dd></div>
            <div><dt>{l.stars}</dt><dd className="tnum">{d ? d.stars : '...'}</dd></div>
          </dl>
          <h4>{l.languages}</h4>
          {d && d.languages.length > 0 ? (
            <>
              <div className="lang-bar" dir="ltr" role="img" aria-label={d.languages.map((x) => `${x.name} ${Math.round(x.share * 100)}%`).join(', ')}>
                {d.languages.map((x, k) => <span key={x.name} style={{ flexGrow: x.share, opacity: 1 - k * 0.17 }} />)}
              </div>
              <ul className="lang-list" dir="ltr">
                {d.languages.map((x, k) => <li key={x.name}><i style={{ opacity: 1 - k * 0.17 }} />{x.name}<span className="tnum">{(x.share * 100).toFixed(1)}%</span></li>)}
              </ul>
            </>
          ) : <div className="lang-bar skel" />}
        </div>
      </div>

      {chart && (
        <div className="gh-graph">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://ghchart.rshah.org/4a6fdc/${GH_USER}`} alt={`GitHub contributions of ${GH_USER}`} loading="lazy" width={663} height={104} onError={() => setChart(false)} />
        </div>
      )}
    </article>
  );
}
