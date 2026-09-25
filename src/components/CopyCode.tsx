'use client';

import { copyText, emit } from '@/lib/client';
import { Icon } from './Icon';

export function CopyCode({ text, label, done }: { text: string; label: string; done: string }) {
  return (
    <button type="button" className="src-copy" onClick={async () => { await copyText(text); emit('toast', done); }}>
      <Icon name="copy" />{label}
    </button>
  );
}
