import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { SourceView } from './SourceView';

const LANES = 3;
const laneX = (l: number) => 10 + l * 22;

/**
 * One row of a `git log --graph`: main runs the whole way down, and each branch runs from the top
 * (it is still active) down to its own commit, where it curves back into main (where it forked).
 */
function Lanes({ row, rows }: { row: number; rows: { lane: number }[] }) {
  const last = rows.length - 1;
  const forkRow = (l: number) => rows.findIndex((r) => r.lane === l);
  const own = rows[row].lane;
  return (
    <div className="lanes" aria-hidden="true">
      {Array.from({ length: LANES }, (_, l) => {
        const style = { insetInlineStart: laneX(l) } as React.CSSProperties;
        if (l === 0) return <span key={l} className={`lane lane-0${row === last ? ' to-dot' : ''}`} style={style} />;
        if (row < forkRow(l)) return <span key={l} className={`lane lane-${l}`} style={style} />;
        if (row === forkRow(l)) {
          const w = laneX(l) - laneX(0);
          return (
            <span key={l}>
              <span className={`lane lane-${l} to-dot`} style={style} />
              <svg className={`fork lane-${l}`} width={w} height={44} viewBox={`0 0 ${w} 44`} style={{ insetInlineStart: laneX(0) + 1 }}>
                <path d={`M ${w} 0 C ${w} 26, 0 18, 0 44`} />
              </svg>
            </span>
          );
        }
        return null;
      })}
      <span className={`commit lane-${own}`} style={{ insetInlineStart: laneX(own) - 5 }} />
    </div>
  );
}

export function Experience({ i }: { i: I18n }) {
  const e = cv.education[0];
  const rows = [...cv.experience.map((j) => ({ lane: j.lane })), { lane: 0 }];
  return (
    <section className="section" id="experience">
      <div className="wrap">
        <div className="ui-view">
          <SectionHead title={i.t(cv.ui.experienceTitle)} />
          <ol className="timeline">
            {cv.experience.map((j, k) => (
              <li className="job reveal" key={j.title.en}>
                <div className="job-when">
                  <span className="tnum">{i.t(j.period)}</span>
                </div>
                <Lanes row={k} rows={rows} />
                <div className="job-body">
                  <span className={`branch lane-${j.lane}`}><Icon name="branch" />{j.branch}</span>
                  <h3>{i.t(j.title)}</h3>
                  <p className="org">{i.t(j.org)}</p>
                  <ul className="job-points">{i.tl(j.points).map((pt) => <li key={pt}>{pt}</li>)}</ul>
                  <ul className="tags">{j.tags.map((x) => <li key={x}>{x}</li>)}</ul>
                </div>
              </li>
            ))}
            <li className="job job-edu reveal">
              <div className="job-when"><Icon name="grad" /><span>{i.t(e.period)}</span></div>
              <Lanes row={rows.length - 1} rows={rows} />
              <div className="job-body">
                <span className="branch lane-0"><Icon name="commit" />{i.L('کامیت اول', 'initial commit')}</span>
                <h3>{i.t(cv.ui.educationTitle)}: {i.t(e.title)}</h3>
                <p className="org">{i.t(e.org)}</p>
                <p className="job-note">{i.t(e.note)}</p>
              </div>
            </li>
          </ol>
        </div>
        <SourceView file="experience.ts" kind="experience" lang={i.lang} />
      </div>
    </section>
  );
}
