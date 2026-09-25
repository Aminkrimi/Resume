import { cv } from '@/data/cv';
import { pad, type I18n } from '@/lib/i18n';
import { GithubGraph } from './GithubGraph';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { vars } from './style';

const BAR_WIDTHS = [92, 96, 88];

export function About({ i }: { i: I18n }) {
  const p = cv.person;
  return (
    <section className="section" id="about">
      <div className="wrap">
        <SectionHead index={1} id="about" label={i.t(cv.ui.nav.about)} title={i.t(cv.ui.aboutTitle)} />
        <div className="bento">
          <article className="card about-text reveal">
            <div className="card-label"><Icon name="file" /> README.md</div>
            {cv.about.paragraphs.map((x, k) => <p key={k}>{i.t(x)}</p>)}
          </article>
          <article className="card about-now reveal" style={vars({ '--d': 1 })}>
            <div className="card-label"><Icon name="pin" /> {i.L('همین حالا', 'Right now')}</div>
            <div className="now-row"><span>{i.L('وضعیت', 'Status')}</span><b className="status"><span className="dot" />{i.t(p.availability)}</b></div>
            <div className="now-row"><span>{i.L('موقعیت', 'Based in')}</span><b>{i.t(p.location)}</b></div>
            <div className="now-row"><span>{i.t(cv.ui.localTime)}</span><b className="mono" data-clock={i.lang}>--:--</b></div>
            <div className="now-row"><span>{i.L('زبان‌ها', 'Languages')}</span><b>{i.L('فارسی (مادری) · انگلیسی', 'Persian (native) · English')}</b></div>
          </article>
          <article className="card about-interests reveal" style={vars({ '--d': 2 })}>
            <div className="card-label"><Icon name="bolt" /> {i.t(cv.ui.interestsTitle)}</div>
            <div className="chips">
              {cv.about.interests.map((x) => <span className="chip" key={x.en}><Icon name={x.icon} />{i.t(x)}</span>)}
            </div>
          </article>
          <article className="card about-os reveal" style={vars({ '--d': 1 })}>
            <div className="card-label"><Icon name="cpu" /> personality.config</div>
            <div className="os-grid">
              {cv.about.personality.map((x, k) => (
                <div className="os-item" key={x.code}>
                  <span className="code"><em>{x.code[0]}</em>{x.code.slice(1)}</span>
                  <h4>{i.t(x.label)}</h4>
                  <p>{i.t(x.desc)}</p>
                  <span className="bar" style={vars({ '--w': `${BAR_WIDTHS[k]}%` })} />
                </div>
              ))}
            </div>
          </article>
          <GithubGraph title={i.t(cv.ui.githubTitle)} />
        </div>
        <h3 className="services-title reveal">{i.t(cv.ui.servicesTitle)}</h3>
        <div className="services">
          {cv.services.map((s, k) => (
            <article className="card service reveal" style={vars({ '--d': k })} key={s.icon}>
              <span className="num">{pad(k + 1)} / {pad(cv.services.length)}</span>
              <span className="ico"><Icon name={s.icon} /></span>
              <h3>{i.t(s.title)}</h3>
              <p>{i.t(s.desc)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
