import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { Playground } from './Playground';
import { SectionHead } from './SectionHead';

/** Already code, so it looks the same in the regular and the source view. */
export function PlaygroundSection({ i }: { i: I18n }) {
  const ex = cv.ui.playExamples;
  return (
    <section className="section" id="playground">
      <div className="wrap">
        <SectionHead title={i.t(cv.ui.playTitle)} lead={i.t(cv.ui.playLead)} />
        <Playground l={{
          run: i.t(cv.ui.run), console: i.t(cv.ui.console), idle: i.t(cv.ui.playIdle), timeout: i.t(cv.ui.playTimeout),
          examples: [i.t(ex.skills), i.t(ex.years), i.t(ex.tech), i.t(ex.hire)],
        }} />
      </div>
    </section>
  );
}
