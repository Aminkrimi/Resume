'use client';

import type { ReactNode } from 'react';
import { emit, type CvEvent } from '@/lib/client';

export function ActionButton({ action, className, children, label }: { action: CvEvent; className?: string; children: ReactNode; label?: string }) {
  return (
    <button type="button" className={className} aria-label={label} onClick={() => emit(action)}>
      {children}
    </button>
  );
}
