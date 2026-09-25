import { cv } from '@/data/cv';
import { asset, type I18n } from '@/lib/i18n';
import { Icon } from './Icon';
import { SectionHead } from './SectionHead';
import { SourceView } from './SourceView';
import { aboutSource } from '@/lib/source';

const years = () => new Date().getFullYear() - cv.person.startYear;

export function About({ i }: { i: I18n }) {
  const p = cv.person;
  const tools = cv.skills.reduce((a, g) => a + g.items.length, 0) + cv.also.length;
  const stats = [
    { v: years(), label: cv.ui.yearsLabel },
    { v: cv.projects.length, label: cv.ui.projectsLabel },
    { v: tools, label: cv.ui.stackLabel },
  ];
  const facts = [
    { k: i.L('موقعیت', 'Based in'), v: i.t(p.location) },
    { k: i.t(cv.ui.localTime), v: <span className="tnum" data-clock={i.lang}>--:--</span> },
    { k: i.L('زبان‌ها', 'Languages'), v: i.L('فارسی (مادری)، انگلیسی', 'Persian (native), English') },
    { k: i.t(cv.education[0].title), v: i.t(cv.education[0].org) },
  ];

  return (
    <section className="section" id="about">
      <div className="wrap">
        <div className="ui-view">
          <div className="about-grid">
            <div className="about-copy">
              <SectionHead title={i.t(cv.ui.aboutTitle)} />
              {cv.about.paragraphs.map((x, k) => <p className="reveal" key={k}>{i.t(x)}</p>)}
            </div>
            <aside className="about-side reveal">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="about-photo" src={asset('/img/profile.webp')} alt={i.t(p.name)} width={900} height={900} loading="lazy" decoding="async" />
              <dl className="stats">
                {stats.map((s) => (
                  <div key={s.label.en}>
                    <dt>{i.t(s.label)}</dt>
                    <dd className="tnum">{i.num(s.v)}+</dd>
                  </div>
                ))}
              </dl>
              <dl className="facts">
                {facts.map((f) => <div key={f.k}><dt>{f.k}</dt><dd>{f.v}</dd></div>)}
              </dl>
              <div className="interests">
                <h3>{i.t(cv.ui.interestsTitle)}</h3>
                <ul className="chips">
                  {cv.about.interests.map((x) => <li className="chip" key={x.en}><Icon name={x.icon} />{i.t(x)}</li>)}
                </ul>
              </div>
            </aside>
          </div>

          <div className="traits reveal">
            <h3>{i.t(cv.ui.personalityTitle)}</h3>
            <ul>
              {cv.about.personality.map((x) => (
                <li key={x.code}>
                  <b>{x.code}</b>
                  <span>{i.t(x.label)}</span>
                  <small>{i.t(x.desc)}</small>
                </li>
              ))}
            </ul>
          </div>

          <div className="services">
            <h3 className="services-title reveal">{i.t(cv.ui.servicesTitle)}</h3>
            <ul className="services-grid">
              {cv.services.map((s, k) => (
                <li className="service reveal" style={{ '--d': k % 2 } as React.CSSProperties} key={s.icon}>
                  <Icon name={s.icon} className="service-ico" />
                  <h4>{i.t(s.title)}</h4>
                  <p>{i.t(s.desc)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <SourceView file="about.md" lines={aboutSource(i)} i={i} />
      </div>
    </section>
  );
}
