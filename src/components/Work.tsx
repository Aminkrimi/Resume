import { cv } from '@/data/cv';
import type { Project } from '@/data/types';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { Shot } from './Shot';

const hostOf = (url?: string) => (url ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const ext = { target: '_blank', rel: 'noopener' } as const;

function Stack({ items }: { items: string[] }) {
  return <ul className="tags">{items.map((s) => <li key={s}>{s}</li>)}</ul>;
}

function Featured({ p, i }: { p: Project; i: I18n }) {
  return (
    <article className="featured reveal">
      <div className="featured-copy">
        <p className="featured-tag">{i.t(cv.ui.featured)}</p>
        <h3>{i.t(p.title)}</h3>
        <p>{i.t(p.desc)}</p>
        <Stack items={p.stack} />
        {p.url && <a className="btn btn-primary" href={p.url} {...ext}>{i.t(cv.ui.visit)}<Icon name="arrow" className="i-go" /></a>}
      </div>
      {p.highlights && (
        <ol className="featured-list">
          {p.highlights.map((h) => <li key={h.en}>{i.t(h)}</li>)}
        </ol>
      )}
      {p.img && <Shot src={p.img} alt={i.t(p.title)} className="featured-shot" />}
    </article>
  );
}

export function Work({ i }: { i: I18n }) {
  const featured = cv.projects.filter((p) => p.featured);
  const sites = cv.projects.filter((p) => !p.featured && p.img);
  const oss = cv.projects.filter((p) => !p.featured && !p.img);

  return (
    <section className="section" id="work">
      <div className="wrap">
        <SectionHead title={i.t(cv.ui.workTitle)} />
        {featured.map((p) => <Featured p={p} i={i} key={p.id} />)}

        <h3 className="sub-title reveal">{i.t(cv.ui.clientTitle)}</h3>
        <div className="gallery">
          {sites.map((p, k) => (
            <a className="site reveal" href={p.url} {...ext} key={p.id} style={{ '--d': k % 2 } as React.CSSProperties}>
              <Shot src={p.img!} alt={i.t(p.title)} />
              <div className="site-meta">
                <div>
                  <h4>{i.t(p.title)}</h4>
                  <p>{i.t(p.desc)}</p>
                </div>
                <span className="site-host ltr">{hostOf(p.url)}<Icon name="arrow" className="i-go" /></span>
              </div>
            </a>
          ))}
        </div>

        <h3 className="sub-title reveal">{i.t(cv.ui.ossTitle)}</h3>
        <ul className="oss">
          {oss.map((p) => (
            <li className="reveal" key={p.id}>
              <a href={p.code} {...ext}>
                {p.glyph && <Icon name={p.glyph} className="oss-ico" />}
                <span className="oss-text">
                  <b>{i.t(p.title)}</b>
                  <span>{i.t(p.desc)}</span>
                </span>
                <Stack items={p.stack} />
                <span className="oss-go"><Icon name="github" /><Icon name="arrow" className="i-go" /></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
