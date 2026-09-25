import type { Metadata } from 'next';
import { Changelog } from '@/components/Changelog';
import { asset } from '@/lib/i18n';

export const metadata: Metadata = {
  alternates: { languages: { fa: asset('/changelog/'), en: asset('/en/changelog/') } },
  title: 'تغییرات | محمد امین کریمی',
  description: 'تاریخچهٔ تغییرات همین سایت، ساخته‌شده از git log.',
};

export default function Page() {
  return <Changelog lang="fa" />;
}
