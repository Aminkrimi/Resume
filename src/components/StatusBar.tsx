import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { ActionButton } from './ActionButton';
import { Icon } from './Icon';

/**
 * A VS Code-style status bar (desktop only). The file name follows the section in view (set by
 * Effects), the percentage is a CSS scroll-driven counter, and the clock is Tehran time.
 */
export function StatusBar({ i }: { i: I18n }) {
  return (
    <footer className="statusbar" dir="ltr" aria-label={i.L('نوار وضعیت', 'Status bar')}>
      <ActionButton action="terminal" className="sb-item sb-branch" label={i.L('باز کردن ترمینال', 'Open terminal')}><Icon name="branch" />main</ActionButton>
      <span className="sb-item"><Icon name="check" />0 problems</span>
      <ActionButton action="palette" className="sb-item sb-file" label={i.L('پالت فرمان', 'Command palette')}><Icon name="braces" /><span data-sb-file>amin.tsx</span></ActionButton>
      <span className="sb-spacer" />
      <span className="sb-item sb-pct" aria-hidden="true" />
      <span className="sb-item sb-wide">UTF-8</span>
      <span className="sb-item sb-wide">TypeScript JSX</span>
      <span className="sb-item sb-wide">{i.lang === 'fa' ? 'RTL' : 'LTR'}</span>
      <span className="sb-item"><Icon name="globe" />{i.L('تهران', 'Tehran')} <b className="tnum" data-clock={i.lang}>--:--</b></span>
      <span className="sb-item sb-ok">{i.t(cv.person.available ? cv.ui.sbOpen : cv.ui.sbBusy)}</span>
    </footer>
  );
}
