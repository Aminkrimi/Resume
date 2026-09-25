'use client';

import { useState } from 'react';
import { Icon } from './Icon';

/** Contribution chart from ghchart; the whole card hides itself if the image fails. */
export function GithubGraph({ title }: { title: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <article className="card about-gh reveal">
      <div className="gh-head">
        <div className="card-label"><Icon name="github" /> {title}</div>
        <a className="link-go" href="https://github.com/Aminkrimi" target="_blank" rel="noopener">github.com/Aminkrimi <Icon name="arrow" className="i-go" /></a>
      </div>
      <div className="gh-graph">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="https://ghchart.rshah.org/2563eb/Aminkrimi" alt="GitHub contributions of Aminkrimi" loading="lazy" onError={() => setFailed(true)} />
      </div>
    </article>
  );
}
