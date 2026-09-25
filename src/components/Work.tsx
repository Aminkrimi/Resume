'use client';

import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { cv } from '@/data/cv';
import type { Lang, Project } from '@/data/types';
import { asset, makeI18n, pad, type I18n } from '@/lib/i18n';
import { prefersReduced } from '@/lib/client';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { vars } from './style';

const CODE_LINES: Partial<Record<string, string>> = {
  search: 'const q = useDebounce(keyword, 500);',
  chart: 'const { data } = await axios.get(API);',
  brain: 'model.fit(X_train, y_train)',
  tree: 'huffman(freq).encode(text)',
};

const hostOf = (url?: string) => (url ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

function BrowserMock({ host }: { host: string }) {
  return (
    <div className="mock" aria-hidden="true">
      <div className="mock-url"><span className="lights"><i /><i /><i /></span><span>{host}</span></div>
      <div className="mock-body">
        <div className="mock-main">
          <div className="mock-kpis">{[0, 1, 2, 3].map((k) => <div key={k}><i /><b /></div>)}</div>
          <div className="mock-chart">{[38, 52, 44, 70, 58, 66, 49, 82, 61, 74, 57, 92].map((h, k) => <i key={k} style={vars({ '--h': `${h}%`, '--k': k })} />)}</div>
          <div className="mock-rows">{[0, 1, 2, 3].map((k) => <div key={k}><span /><span /><span /><span /></div>)}</div>
        </div>
        <div className="mock-side">{[0, 1, 2, 3, 4, 5, 6].map((k) => <i key={k} />)}</div>
      </div>
    </div>
  );
}

/** Screenshot on top of a browser mock; if the screenshot is missing the mock shows through. */
function Screenshot({ p, alt }: { p: Project; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (!p.img || failed) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img ref={ref} src={asset(p.img)} alt={alt} loading="lazy" decoding="async" width={1100} height={520} onError={() => setFailed(true)} />;
}

function ProjectCard({ p, index, i, hidden }: { p: Project; index: number; i: I18n; hidden: boolean }) {
  const host = hostOf(p.url);
  return (
    <article className={`card project reveal${p.featured ? ' featured' : ''}`} style={vars({ '--d': index % 3 })} hidden={hidden}>
      <div className="project-media">
        {p.mock && <BrowserMock host={host} />}
        {p.img ? <Screenshot p={p} alt={i.t(p.title)} /> : (
          <div className="glyph">{p.glyph && <Icon name={p.glyph} />}<span className="code-line">{p.glyph ? CODE_LINES[p.glyph] : ''}</span></div>
        )}
        {!p.mock && <span className="idx">#{pad(index + 1)}{host && ` · ${host}`}</span>}
      </div>
      <div className="project-body">
        <h3>{i.t(p.title)}</h3>
        <p>{i.t(p.desc)}</p>
        <div className="project-foot">
          <div className="tags">{p.stack.map((s) => <span className="tag-s" key={s}>{s}</span>)}</div>
          {p.url
            ? <a className="link-go" href={p.url} target="_blank" rel="noopener">{i.t(cv.ui.visit)} <Icon name="arrow" className="i-go" /></a>
            : <a className="link-go" href={p.code} target="_blank" rel="noopener"><Icon name="github" /> {i.t(cv.ui.source)}</a>}
        </div>
      </div>
    </article>
  );
}

export function Work({ lang }: { lang: Lang }) {
  const i = makeI18n(lang);
  const [filter, setFilter] = useState('all');
  const count = (id: string) => (id === 'all' ? cv.projects.length : cv.projects.filter((p) => p.cat.includes(id)).length);

  const choose = (id: string) => {
    const run = () => flushSync(() => setFilter(id));
    if (document.startViewTransition && !prefersReduced()) document.startViewTransition(run);
    else run();
  };

  return (
    <section className="section" id="work">
      <div className="wrap">
        <SectionHead index={4} id="work" label={i.t(cv.ui.nav.work)} title={i.t(cv.ui.workTitle)} lead={i.t(cv.ui.workLead)} />
        <div className="filters reveal" role="toolbar">
          {cv.filters.map((f) => (
            <button key={f.id} data-filter={f.id} className="filter" type="button" aria-pressed={f.id === filter} onClick={() => choose(f.id)}>
              {f.id === 'all' ? i.t(cv.ui.filterAll) : f[lang]}<sup>{i.num(count(f.id))}</sup>
            </button>
          ))}
        </div>
        <div className="projects">
          {cv.projects.map((p, k) => (
            <ProjectCard key={p.id} p={p} index={k} i={i} hidden={filter !== 'all' && !p.cat.includes(filter)} />
          ))}
        </div>
      </div>
    </section>
  );
}
