import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { SourceView } from './SourceView';
import { experienceSource } from '@/lib/source';

export function Experience({ i }: { i: I18n }) {
  const e = cv.education[0];
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <div className="ui-view">
          <SectionHead title={i.t(cv.ui.experienceTitle)} />
          <ol className="timeline">
            {cv.experience.map((j) => (
              <li className="job reveal" key={j.title.en}>
                <div className="job-when">
                  <span className="tnum">{i.t(j.period)}</span>
                </div>
                <div className="job-body">
                  <h3>{i.t(j.title)}</h3>
                  <p className="org">{i.t(j.org)}</p>
                  <ul className="job-points">{i.tl(j.points).map((pt) => <li key={pt}>{pt}</li>)}</ul>
                  <ul className="tags">{j.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </li>
            ))}
            <li className="job job-edu reveal">
              <div className="job-when"><Icon name="grad" /><span>{i.t(e.period)}</span></div>
              <div className="job-body">
                <h3>{i.t(cv.ui.educationTitle)}: {i.t(e.title)}</h3>
                <p className="org">{i.t(e.org)}</p>
                <p className="job-note">{i.t(e.note)}</p>
              </div>
            </li>
          </ol>
        </div>
        <SourceView file="experience.ts" lines={experienceSource(i)} i={i} />
      </div>
    </section>
  );
}
