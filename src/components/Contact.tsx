import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { ActionButton } from './ActionButton';
import { ApiForm, type ApiLabels } from './ApiForm';
import { Icon } from './Icon';
import { SourceView } from './SourceView';

export function Contact({ i }: { i: I18n }) {
  const p = cv.person;
  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="ui-view">
          <h2 className="contact-title reveal">{i.t(cv.ui.contactTitle)}</h2>
          <p className="contact-lead reveal">{i.t(cv.ui.contactLead)}</p>
          <div className="mail reveal">
            <a className="mail-link ltr" href={`mailto:${p.email}`}>{p.email}</a>
            <ActionButton action="copy-email" className="btn btn-ghost"><Icon name="copy" />{i.t(cv.ui.copyEmail)}</ActionButton>
          </div>
          <ul className="socials reveal">
            {p.social.filter((s) => s.id !== 'mail').map((s) => (
              <li key={s.id}>
                <a className="social" href={s.url} target="_blank" rel="noopener">
                  <Icon name={s.id} /><span>{s.label}</span><small className="ltr">{s.handle}</small>
                </a>
              </li>
            ))}
            <li>
              <a className="social" href={`tel:${p.phone}`}>
                <Icon name="phone" /><span>{i.L('تلفن', 'Phone')}</span><small className="ltr">{i.t(p.phoneLabel)}</small>
              </a>
            </li>
          </ul>
          <h3 className="api-title reveal">{i.t(cv.ui.apiTitle)}</h3>
          <ApiForm l={Object.fromEntries(Object.entries(cv.ui.api).map(([k, t]) => [k, i.t(t)])) as ApiLabels} />
        </div>
        <SourceView file="contact.sh" kind="contact" lang={i.lang} />
      </div>
    </section>
  );
}
