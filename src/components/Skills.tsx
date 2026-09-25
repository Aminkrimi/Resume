import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { SectionHead } from './SectionHead';
import { vars } from './style';

export const LEVELS = {
  5: { fa: 'مسلط', en: 'EXPERT' },
  4: { fa: 'پیشرفته', en: 'ADVANCED' },
  3: { fa: 'کاربردی', en: 'PROFICIENT' },
  2: { fa: 'آشنا', en: 'FAMILIAR' },
  1: { fa: 'مبتدی', en: 'LEARNING' },
} as const;

const FILE_NAMES = ['core', 'ui', 'tooling', 'backend'];

export function Skills({ i }: { i: I18n }) {
  return (
    <section className="section" id="skills">
      <div className="wrap">
        <SectionHead index={2} id="skills" label={i.t(cv.ui.nav.skills)} title={i.t(cv.ui.skillsTitle)} lead={i.t(cv.ui.skillsLead)} />
        <div className="skills-grid">
          {cv.skills.map((g, gi) => (
            <article className="card skill-group reveal" style={vars({ '--d': gi })} key={g.group.en}>
              <h3>{i.t(g.group)} <small>{FILE_NAMES[gi] ?? 'misc'}.ts</small></h3>
              {g.items.map((s, si) => (
                <div className="skill" key={s.name}>
                  <span className="skill-name">{s.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span className="meter" role="img" aria-label={`${s.level}/5`} style={vars({ '--row': si })}>
                      {[1, 2, 3, 4, 5].map((k) => <i key={k} className={k <= s.level ? 'on' : ''} style={vars({ '--k': k })} />)}
                    </span>
                    <span className="skill-level">{i.t(LEVELS[s.level])}</span>
                  </span>
                </div>
              ))}
            </article>
          ))}
        </div>
        <div className="card also reveal">
          <h4>{i.t(cv.ui.alsoTitle)}</h4>
          {cv.also.map((a) => <span className="chip" key={a}>{a}</span>)}
        </div>
      </div>
    </section>
  );
}
