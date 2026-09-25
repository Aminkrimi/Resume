import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { GithubLive } from './GithubLive';
import { StackGraph } from './StackGraph';
import { SectionHead } from './SectionHead';
import { SourceView } from './SourceView';

export const LEVELS = {
  5: { fa: 'مسلط', en: 'Expert' },
  4: { fa: 'پیشرفته', en: 'Advanced' },
  3: { fa: 'کاربردی', en: 'Proficient' },
  2: { fa: 'آشنا', en: 'Familiar' },
  1: { fa: 'مبتدی', en: 'Learning' },
} as const;

/** Bento: one cell per skill group, one for the extras, one for live GitHub activity. */
export function Skills({ i }: { i: I18n }) {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <div className="ui-view">
          <SectionHead title={i.t(cv.ui.skillsTitle)} lead={i.t(cv.ui.skillsLead)} />
          <div className="bento">
            {cv.skills.map((g, gi) => (
              <article className={`cell cell-${gi} reveal`} style={{ '--d': gi % 2 } as React.CSSProperties} key={g.group.en}>
                <h3>{i.t(g.group)}</h3>
                <ul className="pills">
                  {g.items.map((s) => (
                    <li key={s.name} className={`pill lv-${s.level}`} title={i.t(LEVELS[s.level])}>
                      {s.name}<span className="sr-only"> ({i.t(LEVELS[s.level])})</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
            <article className="cell cell-also reveal">
              <h3>{i.t(cv.ui.alsoTitle)}</h3>
              <ul className="pills">{cv.also.map((a) => <li className="pill lv-3" key={a}>{a}</li>)}</ul>
            </article>
            <GithubLive lang={i.lang} l={{
              title: i.t(cv.ui.githubTitle), commits: i.t(cv.ui.ghCommits), languages: i.t(cv.ui.ghLanguages), repos: i.t(cv.ui.ghRepos),
              stars: i.t(cv.ui.ghStars), error: i.t(cv.ui.ghError), empty: i.t(cv.ui.ghEmpty), profile: i.t(cv.ui.ghProfile),
            }} />
          </div>
          <StackGraph lang={i.lang} title={i.t(cv.ui.graphTitle)} lead={i.t(cv.ui.graphLead)} />
        </div>
        <SourceView file="skills.json" kind="skills" lang={i.lang} />
      </div>
    </section>
  );
}
