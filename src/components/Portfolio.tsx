import { cv } from '@/data/cv';
import type { Lang } from '@/data/types';
import { makeI18n } from '@/lib/i18n';
import { About } from './About';
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
      <div className="grain" aria-hidden="true" />
      <Topbar i={i} />
      <main id="main">
        <Hero i={i} />
        <About i={i} />
        <Skills i={i} />
        <Experience i={i} />
        <Work i={i} />
        <Contact i={i} />
      </main>
      <Footer i={i} />
      <PrintCV i={i} />
      <Overlays lang={lang} />
      <Effects lang={lang} />
    </>
  );
}
