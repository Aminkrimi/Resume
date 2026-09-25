import localFont from 'next/font/local';

export { GeistSans } from 'geist/font/sans';
export { GeistMono } from 'geist/font/mono';

export const Vazirmatn = localFont({
  src: './fonts/vazirmatn-var.woff2',
  weight: '100 900',
  display: 'swap',
  preload: false, // only the Persian page needs it; don't make /en/ download it
  variable: '--font-vazirmatn',
});
