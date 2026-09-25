import type { Lang, T, TList } from '@/data/types';

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
export const asset = (path: string) => `${BASE_PATH}${path}`;

const FA_DIGITS = '۰۱۲۳۴۵۶۷۸۹';

/** Bind helpers to a language so components can write t(obj) / num(7). */
export function makeI18n(lang: Lang) {
  const t = (o: T | undefined) => (o ? o[lang] : '');
  const tl = (o: TList) => o[lang];
  const num = (v: number | string) => (lang === 'fa' ? String(v).replace(/\d/g, (d) => FA_DIGITS[+d]) : String(v));
  const L = (fa: string, en: string) => (lang === 'fa' ? fa : en);
  return { lang, t, tl, num, L, dir: lang === 'fa' ? 'rtl' : 'ltr' } as const;
}
export type I18n = ReturnType<typeof makeI18n>;

export const pad = (v: number) => String(v).padStart(2, '0');
export const langHref = (lang: Lang) => (lang === 'fa' ? '/' : '/en/');
