'use client';

/**
 * Live data from the public GitHub API (no token; 60 requests/hour per visitor IP), cached in
 * sessionStorage for 10 minutes so navigating around the site does not burn the limit.
 */
export const GH_USER = 'Aminkrimi';
const TTL = 10 * 60 * 1000;

export type Commit = { sha: string; message: string; repo: string; url: string; date: string };
export type GhStats = { repos: number; stars: number; languages: { name: string; share: number }[]; commits: Commit[] };

type Repo = { name: string; fork: boolean; stargazers_count: number; language: string | null; size: number; pushed_at: string };
type RepoCommit = { sha: string; html_url: string; author: { login: string } | null; commit: { message: string; author: { date: string } | null } };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`https://api.github.com${path}`, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(res.status === 403 || res.status === 429 ? 'rate-limited' : `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

let inflight: Promise<GhStats> | null = null;

export function loadGithub(): Promise<GhStats> {
  try {
    const hit = JSON.parse(sessionStorage.getItem('cv-gh') ?? 'null') as { at: number; data: GhStats } | null;
    if (hit && Date.now() - hit.at < TTL) return Promise.resolve(hit.data);
  } catch { /* storage unavailable */ }
  inflight ??= (async () => {
    const repos = await get<Repo[]>(`/users/${GH_USER}/repos?per_page=100&sort=pushed`);
    const own = repos.filter((r) => !r.fork);
    const weight = new Map<string, number>();
    own.forEach((r) => { if (r.language) weight.set(r.language, (weight.get(r.language) ?? 0) + Math.max(1, r.size)); });
    const total = [...weight.values()].reduce((a, b) => a + b, 0) || 1;
    const languages = [...weight.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, w]) => ({ name, share: w / total }));
    // The public Events API no longer lists commits, so read the latest commits of the three most
    // recently pushed repos directly (3 small requests).
    const recent = [...own].sort((a, b) => b.pushed_at.localeCompare(a.pushed_at)).slice(0, 3);
    const lists = await Promise.all(recent.map((r) =>
      get<RepoCommit[]>(`/repos/${GH_USER}/${r.name}/commits?per_page=4`).then((cs) => cs.map((c) => ({ c, repo: r.name })), () => [])));
    const commits: Commit[] = lists.flat()
      .filter(({ c }) => !c.author || c.author.login === GH_USER)
      .map(({ c, repo }) => ({ sha: c.sha.slice(0, 7), message: c.commit.message.split('\n')[0], repo, url: c.html_url, date: c.commit.author?.date ?? '' }))
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6);
    const data: GhStats = { repos: own.length, stars: own.reduce((a, r) => a + r.stargazers_count, 0), languages, commits };
    try { sessionStorage.setItem('cv-gh', JSON.stringify({ at: Date.now(), data })); } catch { /* ignore */ }
    return data;
  })().finally(() => { inflight = null; });
  return inflight;
}

export function timeAgo(iso: string, lang: 'fa' | 'en') {
  if (!iso) return '';
  const rtf = new Intl.RelativeTimeFormat(lang === 'fa' ? 'fa' : 'en', { numeric: 'auto' });
  const s = (new Date(iso).getTime() - Date.now()) / 1000;
  const steps: [Intl.RelativeTimeFormatUnit, number][] = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [unit, sec] of steps) if (Math.abs(s) >= sec) return rtf.format(Math.round(s / sec), unit);
  return rtf.format(Math.round(s), 'second');
}
