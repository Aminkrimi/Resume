import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { asset, langHref, makeI18n } from '@/lib/i18n';
import { commitUrl, prUrl, readReleases } from '@/lib/gitlog';
import { Controls } from './Controls';
import { Icon } from './Icon';
import { Overlays } from './Overlays';

const ext = { target: '_blank', rel: 'noopener' } as const;

/** /changelog: this site's own git history, rendered at build time. */
export function Changelog({ lang }: { lang: Lang }) {
  const i = makeI18n(lang);
  const releases = readReleases();
  const home = asset(langHref(lang));
  const fmt = new Intl.DateTimeFormat(lang === 'fa' ? 'fa-IR' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
  const commits = releases.reduce((a, r) => a + Math.max(1, r.commits.length), 0);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <header className="topbar">
        <div className="topbar-in">
          <a className="brand" href={home}>
            <span className="brand-mark" aria-hidden="true">AK</span>
            <span className="brand-name">{i.t(cv.person.name)}</span>
          </a>
          <Controls lang={lang} />
        </div>
      </header>
      <main id="main" className="changelog wrap">
        <a className="link back" href={home}><Icon name="back" className="i-go" />{i.t(cv.ui.backHome)}</a>
        <h1 className="sec-title">{i.t(cv.ui.changelogTitle)}</h1>
        <p className="sec-lead">{i.t(cv.ui.changelogLead)}</p>
        <p className="cl-meta" dir="ltr"><Icon name="commit" />{i.num(releases.length)} releases, {i.num(commits)} commits, built from <code>git log --first-parent</code></p>
        {releases.length === 0 && <p className="gh-note">{i.t(cv.ui.changelogEmpty)}</p>}
        <ol className="cl-list">
          {releases.map((r) => (
            <li key={r.sha} className="cl-item">
              <time className="cl-date" dateTime={r.date}>{fmt.format(new Date(r.date))}</time>
              <div className="cl-body" dir="ltr">
                <h2>
                  {r.pr !== undefined && <a className="cl-pr" href={prUrl(r.pr)} {...ext}>#{r.pr}</a>}
                  {r.title}
                </h2>
                {r.commits.length > 1 || (r.commits.length === 1 && r.commits[0].subject !== r.title) ? (
                  <ul className="cl-commits">
                    {r.commits.map((c) => (
                      <li key={c.sha}><a href={commitUrl(c.sha)} {...ext}><span className="sha">{c.sha.slice(0, 7)}</span>{c.subject}</a></li>
                    ))}
                  </ul>
                ) : (
                  <a className="cl-sha" href={commitUrl(r.commits[0]?.sha ?? r.sha)} {...ext}>{(r.commits[0]?.sha ?? r.sha).slice(0, 7)}</a>
                )}
              </div>
            </li>
          ))}
        </ol>
      </main>
      <Overlays lang={lang} />
    </>
  );
}
