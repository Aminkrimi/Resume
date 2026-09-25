import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { ActionButton } from './ActionButton';
import { Icon } from './Icon';
import { SecLabel } from './SectionHead';

export function Contact({ i }: { i: I18n }) {
  const p = cv.person;
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="contact-box reveal">
          <SecLabel index={5} id="contact" label={i.t(cv.ui.nav.contact)} />
          <h2 className="contact-title">{i.t(cv.ui.contactTitle)}</h2>
          <p className="contact-lead">{i.t(cv.ui.contactLead)}</p>
          <div className="cmd-line">
            <span className="cmd"><span className="p">$</span> mail <a href={`mailto:${p.email}`}>{p.email}</a></span>
            <ActionButton action="copy-email" className="ctrl"><Icon name="copy" /> <span>{i.t(cv.ui.copyEmail)}</span></ActionButton>
          </div>
          <div className="socials">
            {p.social.map((s) => (
              <a className="social" href={s.url} key={s.id} {...(s.id === 'mail' ? {} : { target: '_blank', rel: 'noopener' })}>
                <span className="l"><Icon name={s.id} /><span><b>{s.label}</b><small>{s.handle}</small></span></span>
                <Icon name="arrow" className="i-go" />
              </a>
            ))}
          </div>
          <div className="contact-meta">
            <span><Icon name="pin" /> {i.t(p.location)}</span>
            <span><Icon name="phone" /> <a href={`tel:${p.phone}`} className="ltr">{i.t(p.phoneLabel)}</a></span>
            <span>{i.t(cv.ui.localTime)}: <b data-clock={i.lang}>--:--</b></span>
          </div>
        </div>
      </div>
    </section>
  );
}
