'use client';

import { useState, type FormEvent } from 'react';
import { cv } from '@/data/cv';
import { Icon } from './Icon';

/**
 * Contact form styled as an API request. With NEXT_PUBLIC_FORM_ENDPOINT set (e.g. a Formspree
 * form URL) it really POSTs JSON and shows the real response; without it, it opens the visitor's
 * mail app with the message filled in.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? '';

export type ApiLabels = {
  send: string; sending: string; idle: string; mailto: string; network: string;
  name: string; email: string; message: string; errName: string; errEmail: string; errMessage: string;
};
type Field = 'name' | 'email' | 'message';
type Res = { status: string; ok: boolean; body: string; ms?: number } | null;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function ApiForm({ l }: { l: ApiLabels }) {
  const [v, setV] = useState<Record<Field, string>>({ name: '', email: '', message: '' });
  const [err, setErr] = useState<Partial<Record<Field, string>>>({});
  const [busy, setBusy] = useState(false);
  const [res, setRes] = useState<Res>(null);

  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (v.name.trim().length < 2) e.name = l.errName;
    if (!EMAIL.test(v.email.trim())) e.email = l.errEmail;
    if (v.message.trim().length < 10) e.message = l.errMessage;
    setErr(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (new FormData(e.currentTarget).get('_gotcha')) return; // a bot filled the hidden field
    if (!validate()) return;
    const payload = { name: v.name.trim(), email: v.email.trim(), message: v.message.trim() };
    if (!ENDPOINT) {
      const body = `${payload.message}\n\n${payload.name} <${payload.email}>`;
      window.location.href = `mailto:${cv.person.email}?subject=${encodeURIComponent(`Hello from ${payload.name}`)}&body=${encodeURIComponent(body)}`;
      setRes({ status: 'mailto:', ok: true, body: l.mailto });
      return;
    }
    setBusy(true);
    const t0 = performance.now();
    try {
      const r = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...payload, _subject: `Portfolio: ${payload.name}` }),
      });
      const text = await r.text();
      let pretty = text;
      try { pretty = JSON.stringify(JSON.parse(text), null, 2); } catch { /* not JSON */ }
      setRes({ status: `${r.status} ${r.statusText || (r.ok ? 'OK' : 'Error')}`, ok: r.ok, body: pretty, ms: performance.now() - t0 });
      if (r.ok) setV({ name: '', email: '', message: '' });
    } catch {
      setRes({ status: 'Network error', ok: false, body: l.network, ms: performance.now() - t0 });
    } finally {
      setBusy(false);
    }
  };

  const field = (k: Field) => ({
    id: `api-${k}`, name: k, value: v[k], 'aria-invalid': !!err[k], 'aria-describedby': err[k] ? `api-${k}-err` : undefined,
    onChange: (e: { target: { value: string } }) => { setV((s) => ({ ...s, [k]: e.target.value })); if (err[k]) setErr((s) => ({ ...s, [k]: undefined })); },
  });
  const errorOf = (k: Field) => err[k] && <p className="api-err" id={`api-${k}-err`} dir="auto">{err[k]}</p>;

  return (
    <div className="api reveal" dir="ltr">
      <div className="api-bar">
        <span className="api-method">POST</span>
        <span className="api-url">{ENDPOINT || `mailto:${cv.person.email}`}</span>
        <button type="submit" form="api-form" className="play-run" disabled={busy}>
          <Icon name="arrow" />{busy ? l.sending : l.send}
        </button>
      </div>
      <div className="api-body">
        <form id="api-form" className="api-form" noValidate onSubmit={submit}>
          <div className="api-head">Body <span>application/json</span></div>
          <span className="sx-u">{'{'}</span>
          <div className="api-field">
            <label htmlFor="api-name"><span className="sx-s">&quot;name&quot;</span><span className="sx-u">:</span></label>
            <input {...field('name')} autoComplete="name" placeholder={l.name} dir="auto" />
            {errorOf('name')}
          </div>
          <div className="api-field">
            <label htmlFor="api-email"><span className="sx-s">&quot;email&quot;</span><span className="sx-u">:</span></label>
            <input {...field('email')} type="email" autoComplete="email" placeholder={l.email} />
            {errorOf('email')}
          </div>
          <div className="api-field">
            <label htmlFor="api-message"><span className="sx-s">&quot;message&quot;</span><span className="sx-u">:</span></label>
            <textarea {...field('message')} rows={4} placeholder={l.message} dir="auto" />
            {errorOf('message')}
          </div>
          <span className="sx-u">{'}'}</span>
          {/* Honeypot for spam bots (Formspree convention). */}
          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="api-trap" aria-hidden="true" />
        </form>
        <div className="api-res" aria-live="polite">
          <div className="api-head">Response{res?.ms !== undefined && <span>{Math.round(res.ms)} ms</span>}</div>
          {!res && <p className="play-idle" dir="auto">{l.idle}</p>}
          {res && (
            <>
              <p className={`api-status ${res.ok ? 'ok' : 'bad'}`}>{res.status}</p>
              <pre className="api-out" dir="auto">{res.body}</pre>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
