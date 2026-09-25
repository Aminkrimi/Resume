import type { ReactNode } from 'react';
import type { Lang } from '@/data/types';
import { IconSprite } from './IconSprite';
import '@/app/globals.css';

// Runs before paint: restore the saved theme (or the OS preference) to avoid a flash.
const THEME_SCRIPT = `(function(){var d=document.documentElement,t=null;try{t=localStorage.getItem('cv-theme')}catch(e){}
if(t!=='light'&&t!=='dark')t=matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';d.dataset.theme=t;d.classList.add('js');
try{if(sessionStorage.getItem('cv-boot')||matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('booted');sessionStorage.setItem('cv-boot','1')}catch(e){d.classList.add('booted')}})();`;

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
  return (
    <html lang={lang} dir={lang === 'fa' ? 'rtl' : 'ltr'} data-theme="dark" suppressHydrationWarning>
      {/* App Router root layouts render <head> directly. */}
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@400;500;600;700&family=Vazirmatn:wght@300;400;500;700;800;900&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }} />
      </head>
      <body>
        <IconSprite />
        {children}
      </body>
    </html>
  );
}
