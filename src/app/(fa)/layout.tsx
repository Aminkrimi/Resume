import type { ReactNode } from 'react';
import { RootShell } from '@/components/RootShell';
import { buildMetadata } from '@/lib/metadata';

export { viewport } from '@/lib/metadata';
export const metadata = buildMetadata('fa');

export default function FaLayout({ children }: { children: ReactNode }) {
  return <RootShell lang="fa">{children}</RootShell>;
}
