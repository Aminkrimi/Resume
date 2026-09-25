import type { ReactNode } from 'react';
import type { Lang } from '@/data/types';
import { GeistMono, GeistSans, Vazirmatn } from '@/app/fonts';
import '@/app/globals.css';

// Runs before paint: restore the saved theme (or the OS preference) to avoid a flash.
const THEME_SCRIPT = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('cv-theme')}catch(e){}
if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';d.dataset.theme=t;d.classList.add('js')})();`;

const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Mohammad Amin Karimi',
  alternateName: 'محمد امین کریمی',
  jobTitle: 'Front-End Engineer',
  email: 'mailto:m.amiin.krimi@gmail.com',
  address: { '@type': 'PostalAddress', addressLocality: 'Tehran', addressCountry: 'IR' },
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'University of Qom' },
  knowsAbout: ['React', 'Next.js', 'TypeScript', 'JavaScript', 'CSS', 'UI Engineering', 'Machine Learning'],
  sameAs: ['https://github.com/Aminkrimi', 'https://t.me/AminKrimi', 'https://www.instagram.com/amiin_krimi'],
};

export function RootShell({ lang, children }: { lang: Lang; children: ReactNode }) {
  const fonts = `${GeistSans.variable} ${GeistMono.variable} ${Vazirmatn.variable}`;
  return (
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} data-theme="dark" className={fonts} suppressHydrationWarning>
      {/* App Router root layouts render <head> directly. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
