'use client';

import { useEffect, useRef, useState } from 'react';
import { asset } from '@/lib/i18n';

/** A project screenshot with a 3D pointer tilt. Renders nothing if the file is missing. */
export function Shot({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  const ref = useRef<HTMLImageElement>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, []);
  if (failed) return null;
  return (
    <figure className={`shot ${className}`} data-tilt>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img ref={ref} src={asset(src)} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" width={1100} height={520} onError={() => setFailed(true)} />
    </figure>
  );
}
