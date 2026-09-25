import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import type { CodeLines } from './editorArt';
import { ActionButton } from './ActionButton';
import { HeroScene } from './HeroScene';
import { Icon } from './Icon';

const years = () => new Date().getFullYear() - cv.person.startYear;

// What the 3D editor types out.
const CODE: CodeLines = [
  [['c', '// amin.tsx']],
  [['k', 'import'], ['u', ' { '], ['f', 'Developer'], ['u', ' } '], ['k', 'from'], ['s', " '@/types'"], ['u', ';']],
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
  return (
    <section className="hero" id="hero" aria-label={i.t(p.name)}>
      <div className="wrap hero-grid">
        <div className="hero-main">
          <p className="hero-status rise" style={{ '--d': 0 } as React.CSSProperties}>
            <span className="status-dot" aria-hidden="true" />{i.t(p.availability)}
          </p>
          <h1 className="hero-name rise" style={{ '--d': 1 } as React.CSSProperties}>
            <span>{i.t(p.first)}</span> <span className="hero-last">{i.t(p.last)}</span>
          </h1>
          <p className="hero-lead rise" style={{ '--d': 2 } as React.CSSProperties}>{i.t(cv.ui.heroLead)}</p>
          <div className="hero-cta rise" style={{ '--d': 3 } as React.CSSProperties}>
            <a className="btn btn-primary" href="#work">{i.t(cv.ui.ctaWork)}<Icon name="arrow" className="i-go" /></a>
            <ActionButton action="print" className="btn btn-ghost"><Icon name="download" />{i.t(cv.ui.ctaCv)}</ActionButton>
          </div>
        </div>
        <HeroScene code={CODE} label={i.L('ویرایشگر کد سه‌بعدی که فایل amin.tsx را تایپ می‌کند', 'A 3D code editor typing out amin.tsx')} />
      </div>
    </section>
  );
}
