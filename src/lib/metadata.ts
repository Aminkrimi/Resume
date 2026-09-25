import type { Metadata, Viewport } from 'next';
import type { Lang } from '@/data/types';
import { asset } from './i18n';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#060a13' },
    { media: '(prefers-color-scheme: light)', color: '#f4f7fc' },
  ],
  colorScheme: 'dark light',
};

export function buildMetadata(lang: Lang): Metadata {
  const fa = lang === 'fa';
  return {
    title: fa ? 'محمد امین کریمی — توسعه‌دهندهٔ فرانت‌اند' : 'Mohammad Amin Karimi — Front-End Engineer',
    description: fa
      ? 'محمد امین کریمی، توسعه‌دهندهٔ فرانت‌اند (React، Next.js، TypeScript) در تهران. نمونه‌کارها، سوابق و راه‌های ارتباط.'
      : 'Mohammad Amin Karimi — Front-End Engineer (React, Next.js, TypeScript) based in Tehran. Portfolio, experience and contact.',
    metadataBase: new URL('https://aminkrimi.github.io'),
    authors: [{ name: 'Mohammad Amin Karimi' }],
    icons: { icon: asset('/img/favicon.svg'), apple: asset('/img/profile-sm.png') },
    manifest: asset('/manifest.webmanifest'),
    alternates: { languages: { fa: asset('/'), en: asset('/en/') } },
    openGraph: {
      type: 'profile',
      title: 'Mohammad Amin Karimi — Front-End Engineer',
      description: 'React, Next.js & TypeScript engineer. Portfolio, experience and contact.',
      images: [asset('/img/profile.webp')],
      locale: fa ? 'fa_IR' : 'en_US',
    },
    twitter: { card: 'summary' },
  };
}
