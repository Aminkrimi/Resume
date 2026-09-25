import { cv } from '@/data/cv';
import { asset, type I18n } from '@/lib/i18n';
import { ActionButton } from './ActionButton';
import { HeroScene } from './HeroScene';
import { Icon } from './Icon';

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
        <HeroScene photo={asset('/img/profile.webp')} alt={i.t(p.name)} />
      </div>
    </section>
  );
}
