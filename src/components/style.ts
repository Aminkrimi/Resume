import type { CSSProperties } from 'react';

/** CSS custom properties as a typed style object, e.g. vars({ '--d': 2 }). */
export const vars = (v: Record<`--${string}`, string | number>) => v as CSSProperties;
