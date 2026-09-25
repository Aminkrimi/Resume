import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Controls } from './Controls';
import { SECTIONS } from './SectionHead';

export function Topbar({ i }: { i: I18n }) {
  const links = SECTIONS.map((id) => (
    <li key={id}><a href={`#${id}`} data-nav={id}>{i.t(cv.ui.nav[id])}</a></li>
  ));
  return (
    <>
      <header className="topbar" id="top">
        <div className="topbar-in">
          <a className="brand" href="#hero">
            <span className="brand-mark" aria-hidden="true">AK</span>
            <span className="brand-name">{i.t(cv.person.name)}</span>
          </a>
          <nav className="nav" aria-label="Primary"><ul>{links}</ul></nav>
          <Controls lang={i.lang} />
        </div>
      </header>
      <nav className="dock" aria-label="Sections"><ul>{links}</ul></nav>
    </>
  );
}
