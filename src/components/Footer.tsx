import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';

export function Footer({ i }: { i: I18n }) {
  return (
    <footer className="footer">
      <div className="wrap">
        <p className="big" aria-hidden="true">&lt;Thanks /&gt;</p>
        <div className="footer-in">
          <span>© {i.num(new Date().getFullYear())} {i.t(cv.person.name)} — {i.t(cv.ui.footer)}</span>
          <span>{i.t(cv.ui.builtWith)}</span>
          <span className="mono" style={{ fontSize: '.75rem' }}>{i.t(cv.ui.shortcuts)}</span>
          <a className="to-top" href="#hero"><Icon name="up" /> {i.t(cv.ui.palette.top)}</a>
        </div>
      </div>
    </footer>
  );
}
