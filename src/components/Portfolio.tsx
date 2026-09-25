import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { About } from './About';
import { Boot } from './Boot';
import { Contact } from './Contact';
import { Effects } from './Effects';
import { Experience } from './Experience';
import { Footer } from './Footer';
import { Hero } from './Hero';
import { Overlays } from './Overlays';
import { PrintCV } from './PrintCV';
import { Skills } from './Skills';
import { Topbar } from './Topbar';
import { Work } from './Work';

export function Portfolio({ lang }: { lang: Lang }) {
  const i = makeI18n(lang);
  return (
    <>
      <a className="skip-link" href="#main">{i.t(cv.ui.skip)}</a>
      <div className="progress" aria-hidden="true"><span /></div>
      <div className="bg-grid" aria-hidden="true" />
      <div className="bg-glow" aria-hidden="true" />
      <Topbar i={i} />
      <main id="main">
        <Hero i={i} />
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">{[...cv.marquee, ...cv.marquee].map((m, k) => <span key={k}>{m}</span>)}</div>
        </div>
        <About i={i} />
        <Skills i={i} />
        <Experience i={i} />
        <Work lang={lang} />
        <Contact i={i} />
      </main>
      <Footer i={i} />
      <PrintCV i={i} />
      <Overlays lang={lang} />
      <Effects lang={lang} />
      <Boot />
    </>
  );
}
