import type { ReactNode } from 'react';

/** Small-caps section label with a hairline rule, shared by both columns. */
export function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2.5 flex items-center gap-2 font-display text-[8pt] font-bold tracking-[0.14em] text-navy uppercase">
      {children}
      <span className="h-px flex-1 bg-line" aria-hidden="true" />
    </h2>
  );
}

export function Section({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return (
    <section className={className}>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}
