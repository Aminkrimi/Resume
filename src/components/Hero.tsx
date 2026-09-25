import { cv } from '@/data/cv';
import { asset, type I18n } from '@/lib/i18n';
import { ActionButton } from './ActionButton';
import { Icon } from './Icon';
import { CodeTyper, RoleTyper } from './Typers';

const years = () => new Date().getFullYear() - cv.person.startYear;

const CODE: Parameters<typeof CodeTyper>[0]['lines'] = [
  [['c', '// amin.tsx — hello, world 👋']],
  [['k', 'import'], ['u', ' { '], ['p', 'Developer'], ['u', ' } '], ['k', 'from'], ['s', " '@/types'"], ['u', ';']],
  [],
  [['k', 'export const'], ['p', ' amin'], ['u', ': '], ['f', 'Developer'], ['u', ' = {']],
  [['p', '  name'], ['u', ': '], ['s', "'Mohammad Amin Karimi'"], ['u', ',']],
  [['p', '  role'], ['u', ': '], ['s', "'Front-End Engineer'"], ['u', ',']],
  [['p', '  stack'], ['u', ': ['], ['s', "'React'"], ['u', ', '], ['s', "'Next.js'"], ['u', ', '], ['s', "'TS'"], ['u', '],']],
  [['p', '  experience'], ['u', ': '], ['n', String(years())], ['u', ', '], ['c', '// years']],
  [['p', '  available'], ['u', ': '], ['b', 'true'], ['u', ',']],
  [['u', '};']],
  [],
  [['k', 'export default function'], ['f', ' Hire'], ['u', '() {']],
  [['k', '  return'], ['u', ' <'], ['f', 'Amin'], ['p', ' coffee'], ['u', '={'], ['n', 'Infinity'], ['u', '} />;']],
  [['u', '}']],
];

export function Hero({ i }: { i: I18n }) {
  const p = cv.person;
  const tools = cv.skills.reduce((a, g) => a + g.items.length, 0) + cv.also.length;
  const stats = [
    { v: years(), label: cv.ui.yearsLabel },
    { v: cv.projects.length, label: cv.ui.projectsLabel },
    { v: tools, label: cv.ui.stackLabel },
  ];
  return (
    <section className="hero" id="hero" aria-label="Intro">
      <div className="wrap hero-grid">
        <div className="hero-main">
          <span className="hero-kicker reveal"><span className="dot pulse" />{i.t(p.availability)}</span>
          <p className="hero-hello reveal" style={{ '--d': 1 } as React.CSSProperties}>{'// '}{i.L('سلام، من', "hi there, I'm")}</p>
          <h1 className="hero-name">
            <span className="line"><span>{i.t(p.first)}</span></span>
            <span className="line"><span className="grad-text">{i.t(p.last)}</span></span>
          </h1>
          <p className="hero-role reveal" style={{ '--d': 2 } as React.CSSProperties}>
            <span className="prompt">~$</span><RoleTyper roles={i.tl(p.roles)} /><span className="caret" aria-hidden="true" />
          </p>
          <p className="hero-lead reveal" style={{ '--d': 3 } as React.CSSProperties}>{i.t(cv.ui.heroLead)}</p>
          <div className="hero-cta reveal" style={{ '--d': 4 } as React.CSSProperties}>
            <a className="btn btn-primary" href="#work">{i.t(cv.ui.ctaWork)} <Icon name="arrow" className="i-go" /></a>
            <ActionButton action="terminal" className="btn"><Icon name="terminal" /> {i.t(cv.ui.ctaTerminal)} <kbd>`</kbd></ActionButton>
            <ActionButton action="print" className="btn"><Icon name="download" /> {i.t(cv.ui.ctaCv)}</ActionButton>
          </div>
          <div className="hero-stats reveal" style={{ '--d': 5 } as React.CSSProperties}>
            {stats.map((s) => (
              <div className="stat" key={s.v + i.t(s.label)}>
                <b><span data-count={s.v}>{i.num(s.v)}</span><sup>+</sup></b>
                <span>{i.t(s.label)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-side">
          <div className="photo-card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset('/img/profile.webp')} alt={i.t(p.name)} width={900} height={900} fetchPriority="high" />
            <span className="badge"><span className="dot pulse" /><b>&lt;Amin /&gt;</b> online</span>
          </div>
          <span className="float-chip c1"><Icon name="react" /> React 19</span>
          <span className="float-chip c2"><Icon name="code" /> Next.js · TS</span>
          <div className="editor" aria-label="amin.tsx">
            <div className="editor-bar"><span className="lights"><i /><i /><i /></span><span className="tab"><Icon name="react" />amin.tsx</span></div>
            <pre><CodeTyper lines={CODE} /></pre>
            <div className="editor-status"><span><Icon name="branch" /> main</span><span>✓ 0 problems · TypeScript</span></div>
          </div>
        </div>
      </div>
      <a className="scroll-cue" href="#about" aria-label={i.t(cv.ui.scroll)}><span />{i.t(cv.ui.scroll)}</a>
    </section>
  );
}
