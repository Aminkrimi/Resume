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
        <a className="brand" href="#hero" aria-label="Home">
          <span className="brand-mark">&lt;/&gt;</span>
          <span className="brand-name">amin<b>.</b>karimi</span>
        </a>
        <nav className="nav" aria-label="Primary"><ul>{links}</ul></nav>
        <Controls lang={i.lang} />
      </header>
      <nav className="dock" aria-label="Sections"><ul>{links}</ul></nav>
    </>
  );
}
