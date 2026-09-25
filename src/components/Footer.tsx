import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { PerfStats } from './PerfStats';

export function Footer({ i }: { i: I18n }) {
  return (
    <footer className="footer">
      <div className="wrap footer-in">
        <span>© {i.num(new Date().getFullYear())} {i.t(cv.person.name)}</span>
        <span className="footer-built">{i.t(cv.ui.builtWith)}</span>
        <PerfStats title={i.t(cv.ui.perfTitle)} />
        <span className="footer-keys">{i.t(cv.ui.shortcuts)}</span>
        <a className="link" href="#hero"><Icon name="up" />{i.t(cv.ui.palette.top)}</a>
      </div>
    </footer>
  );
}
