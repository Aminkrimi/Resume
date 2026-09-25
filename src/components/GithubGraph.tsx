'use client';

import { useState } from 'react';
import { Icon } from './Icon';

/** Contribution chart from ghchart; the cell hides itself if the image fails. */
export function GithubGraph({ title }: { title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <article className="cell cell-gh reveal">
      <div className="gh-head">
        <h3>{title}</h3>
        <a className="link" href="https://github.com/Aminkrimi" target="_blank" rel="noopener"><Icon name="github" />Aminkrimi<Icon name="arrow" className="i-go" /></a>
      </div>
      <div className="gh-graph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ghchart.rshah.org/4a6fdc/Aminkrimi" alt="GitHub contributions of Aminkrimi" loading="lazy" width={663} height={104} onError={() => setFailed(true)} />
      </div>
    </article>
  );
}
