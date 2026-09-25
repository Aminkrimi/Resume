import { execSync } from 'node:child_process';

/** Build-time only: reads this repository's own history for the changelog page. */
export type Release = { sha: string; date: string; title: string; pr?: number; commits: { sha: string; subject: string }[] };

const REPO = 'https://github.com/Aminkrimi/Resume';
export const prUrl = (n: number) => `${REPO}/pull/${n}`;
export const commitUrl = (sha: string) => `${REPO}/commit/${sha}`;

const git = (args: string) => execSync(`git ${args}`, { encoding: 'utf8', maxBuffer: 1 << 24, stdio: ['ignore', 'pipe', 'ignore'] });

/**
 * One entry per change that landed on the main line (`--first-parent`). A merged pull request
 * lists the commits it brought in. Returns [] when git or its history is unavailable.
 */
export function readReleases(): Release[] {
  try {
    const raw = git('log --first-parent --date=short --pretty=format:%H%x1f%ad%x1f%s%x1f%b%x1e');
    return raw.split('\x1e').map((r) => r.trim()).filter(Boolean).map((r) => {
      const [sha, date, subject, body = ''] = r.split('\x1f');
      const merge = subject.match(/^Merge pull request #(\d+) from /);
      if (!merge) return { sha, date, title: subject, commits: [] };
      let commits: Release['commits'] = [];
      try {
        commits = git(`log --pretty=format:%H%x1f%s ${sha}^1..${sha}^2`).split('\n').filter(Boolean).map((l) => {
          const [h, s] = l.split('\x1f');
          return { sha: h, subject: s };
        });
      } catch { /* shallow history */ }
      return { sha, date, title: body.trim().split('\n')[0] || subject, pr: Number(merge[1]), commits };
    });
  } catch {
    return [];
  }
}
