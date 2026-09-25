import type { IconName } from '@/data/types';

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  return (
    <svg className={`i ${className}`} aria-hidden="true">
      <use href={`#i-${name}`} />
    </svg>
  );
}
