import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { vars } from './style';

export const HASHES = ['a3f9c21', '7be04d9', '4c2e81f', '19d7a3b', 'e5b6f02'];

export function Experience({ i }: { i: I18n }) {
  const e = cv.education[0];
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <SectionHead index={3} id="experience" label={i.t(cv.ui.nav.experience)} title={i.t(cv.ui.experienceTitle)} />
        <div className="timeline-wrap">
          <div className="timeline" id="timeline">
            {cv.experience.map((j, k) => (
              <article className="card job reveal" style={vars({ '--d': k % 2 })} key={j.title.en}>
                <span className="hash">commit {HASHES[k % HASHES.length]}{k === 0 && ' (HEAD → main)'}</span>
                <div className="job-head">
                  <div>
                    <h3>{i.t(j.title)}{k === 0 && <span className="live"><span className="dot" />HEAD</span>}</h3>
                    <div className="org">{i.t(j.org)}</div>
                  </div>
                  <span className="period">{i.t(j.period)}</span>
                </div>
                <ul>{i.tl(j.points).map((pt) => <li key={pt}>{pt}</li>)}</ul>
                <div className="tags">{j.tags.map((x) => <span className="tag-s" key={x}>{x}</span>)}</div>
              </article>
            ))}
          </div>
          <aside className="card edu reveal" style={vars({ '--d': 1 })}>
            <div className="card-label"><Icon name="grad" /> {i.t(cv.ui.educationTitle)}</div>
            <span className="period">{i.t(e.period)}</span>
            <h3>{i.t(e.title)}</h3>
            <div className="org">{i.t(e.org)}</div>
            <p>{i.t(e.note)}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
