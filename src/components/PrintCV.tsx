import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';

const short = (url?: string) => (url ?? '').replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Hidden on screen; the print stylesheet shows only this clean A4 résumé. */
export function PrintCV({ i }: { i: I18n }) {
  const p = cv.person;
  const e = cv.education[0];
  return (
    <article className="print-cv" aria-hidden="true">
      <header className="pcv-head">
        <div>
          <h1>{i.t(p.name)}</h1>
          <div className="role">{i.t(p.role)} · React · Next.js · TypeScript</div>
          <div>{i.t(p.location)}</div>
        </div>
        <div className="pcv-contact">
          <span>{p.email}</span><span>{p.phone}</span><span>github.com/Aminkrimi</span><span>t.me/AminKrimi</span>
        </div>
      </header>
      <h2>{i.L('درباره', 'Profile')}</h2>
      <p>{i.t(cv.about.paragraphs[0])} {i.t(cv.about.paragraphs[1])}</p>
      <h2>{i.L('تجربه', 'Experience')}</h2>
      {cv.experience.map((j) => (
        <div className="pcv-job" key={j.title.en}>
          <div className="row">{i.t(j.title)}, {i.t(j.org)}<span>{i.t(j.period)}</span></div>
          <ul>{i.tl(j.points).map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
      ))}
      <h2>{i.L('مهارت‌ها', 'Skills')}</h2>
      <div className="pcv-skills">
        {cv.skills.map((g) => <div key={g.group.en}><b>{i.t(g.group)}:</b> {g.items.map((s) => s.name).join(' · ')}</div>)}
      </div>
      <h2>{i.L('نمونه‌کارها', 'Selected Projects')}</h2>
      <div className="pcv-proj">
        {cv.projects.map((x) => <div key={x.id}><b>{i.t(x.title)}:</b> {i.t(x.desc)} <span>{short(x.url ?? x.code)}</span></div>)}
      </div>
      <h2>{i.L('تحصیلات', 'Education')}</h2>
      <div className="pcv-job"><div className="row">{i.t(e.period)} {i.t(e.title)}, {i.t(e.org)}</div></div>
    </article>
  );
}
