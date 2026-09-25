import { cv } from '@/data/cv';
import type { CodeLines, Token } from '@/components/editorArt';
import type { I18n } from './i18n';

/**
 * Turns the real résumé data into highlighted source for the "source view": each section
 * shows the file it is built from. Output is token lines, rendered by <SourceView />.
 */

type Style = { quote: '"' | "'"; quoteKeys: boolean; trailing: boolean };
const JSON_STYLE: Style = { quote: '"', quoteKeys: true, trailing: false };
const TS_STYLE: Style = { quote: "'", quoteKeys: false, trailing: true };

const str = (s: string, st: Style): Token => ['s', `${st.quote}${s.replaceAll('\\', '\\\\').replaceAll(st.quote, `\\${st.quote}`)}${st.quote}`];
const prim = (v: unknown, st: Style): Token =>
  typeof v === 'string' ? str(v, st) : typeof v === 'number' ? ['n', String(v)] : typeof v === 'boolean' ? ['b', String(v)] : ['k', 'null'];
const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object';

function emit(v: unknown, depth: number, head: Token[], tail: string, out: CodeLines, st: Style) {
  const pad: Token = ['u', '  '.repeat(depth)];
  if (!isObj(v)) { out.push([pad, ...head, prim(v, st), ['u', tail]]); return; }
  const arr = Array.isArray(v);
  const entries: [string | null, unknown][] = arr ? (v as unknown[]).map((x) => [null, x]) : Object.entries(v);
  // Short arrays of primitives stay on one line.
  if (arr && entries.every(([, x]) => !isObj(x)) && entries.reduce((a, [, x]) => a + String(x).length + 4, 0) < 64) {
    const items: Token[] = entries.flatMap(([, x], k) => (k ? [['u', ', '] as Token, prim(x, st)] : [prim(x, st)]));
    out.push([pad, ...head, ['u', '['], ...items, ['u', `]${tail}`]]);
    return;
  }
  out.push([pad, ...head, ['u', arr ? '[' : '{']]);
  entries.forEach(([k, x], i) => {
    const comma = i < entries.length - 1 || st.trailing ? ',' : '';
    const key: Token[] = k === null ? [] : [st.quoteKeys || !/^[A-Za-z_$][\w$]*$/.test(k) ? str(k, st) : ['p', k], ['u', ': ']];
    emit(x, depth + 1, key, comma, out, st);
  });
  out.push([pad, ['u', `${arr ? ']' : '}'}${tail}`]]);
}

const tsConst = (name: string, type: string, value: unknown): CodeLines => {
  const out: CodeLines = [];
  emit(value, 0, [['k', 'export const '], ['p', name], ['u', ': '], ['f', type], ['u', ' = ']], ';', out, TS_STYLE);
  return out;
};

/** Soft-wraps prose for Markdown so lines stay readable. */
const wrap = (text: string, width = 78) => text.split(' ').reduce<string[]>((lines, word) => {
  const last = lines.at(-1);
  if (last !== undefined && (last + ' ' + word).length <= width) lines[lines.length - 1] = `${last} ${word}`;
  else lines.push(word);
  return lines;
}, []);

export function aboutSource(i: I18n): CodeLines {
  const md: CodeLines = [
    [['k', `# ${i.t(cv.person.name)}`]],
    [['c', `> ${i.t(cv.person.role)}, ${i.t(cv.person.location)}`]],
    [],
  ];
  cv.about.paragraphs.forEach((p) => { wrap(i.t(p)).forEach((l) => md.push([['p', l]])); md.push([]); });
  md.push([['k', `## ${i.t(cv.ui.personalityTitle)}`]]);
  cv.about.personality.forEach((x) => md.push([['u', '- '], ['f', `**${x.code}**`], ['p', ` ${i.t(x.label)}. ${i.t(x.desc)}`]]));
  md.push([], [['k', `## ${i.t(cv.ui.servicesTitle)}`]]);
  cv.services.forEach((s) => md.push([['u', '- '], ['f', `**${i.t(s.title)}**`]]));
  md.push([], [['k', `## ${i.t(cv.ui.interestsTitle)}`]]);
  md.push([['u', '- '], ['p', cv.about.interests.map((x) => i.t(x)).join(', ')]]);
  return md;
}

export function skillsSource(i: I18n): CodeLines {
  const data: Record<string, unknown> = {};
  cv.skills.forEach((g) => { data[i.t(g.group)] = Object.fromEntries(g.items.map((s) => [s.name, s.level])); });
  data[i.t(cv.ui.alsoTitle)] = cv.also;
  const out: CodeLines = [];
  emit(data, 0, [], '', out, JSON_STYLE);
  return out;
}

export function experienceSource(i: I18n): CodeLines {
  const e = cv.education[0];
  return [
    [['k', 'import type'], ['u', ' { '], ['f', 'Job'], ['u', ' } '], ['k', 'from'], ['s', " './types'"], ['u', ';']],
    [],
    ...tsConst('experience', 'Job[]', cv.experience.map((j) => ({
      branch: j.branch, since: j.since, title: i.t(j.title), org: i.t(j.org), points: i.tl(j.points), stack: j.tags,
    }))),
    [],
    ...tsConst('education', 'Degree', { title: i.t(e.title), school: i.t(e.org), level: i.t(e.period), projects: ['Huffman coding', 'LCS'] }),
  ];
}

export function workSource(i: I18n): CodeLines {
  return [
    [['k', 'import type'], ['u', ' { '], ['f', 'Project'], ['u', ' } '], ['k', 'from'], ['s', " './types'"], ['u', ';']],
    [],
    ...tsConst('projects', 'Project[]', cv.projects.map((p) => ({
      id: p.id, title: i.t(p.title), ...(p.url ? { url: p.url } : { repo: p.code }), stack: p.stack,
    }))),
  ];
}

export function contactSource(i: I18n): CodeLines {
  const p = cv.person;
  const open = (url: string): Token[] => [['f', 'open'], ['s', ` "${url}"`]];
  return [
    [['c', '#!/usr/bin/env bash']],
    [['c', `# ${i.t(cv.ui.contactTitle)}`]],
    [],
    [['p', 'EMAIL'], ['u', '='], ['s', `"${p.email}"`]],
    [['p', 'PHONE'], ['u', '='], ['s', `"${p.phone}"`]],
    [['p', 'TZ'], ['u', '='], ['s', `"${p.timezone}"`]],
    [],
    ...p.social.filter((s) => s.id !== 'mail').map((s) => open(s.url)),
    [],
    [['f', 'mail'], ['u', ' -s '], ['s', '"Hello Amin"'], ['u', ' '], ['s', '"$EMAIL"'], ['u', ' < '], ['p', 'idea.md']],
    ...(process.env.NEXT_PUBLIC_FORM_ENDPOINT ? [
      [],
      [['c', '# or the same request the form on this page sends']],
      [['f', 'curl'], ['u', ' -X POST '], ['s', `"${process.env.NEXT_PUBLIC_FORM_ENDPOINT}"`], ['u', ' \\']],
      [['u', '  -H '], ['s', "'Content-Type: application/json'"], ['u', ' \\']],
      [['u', '  -d '], ['s', `'{"name":"Ada","email":"ada@example.com","message":"Hi"}'`]],
    ] as CodeLines : []),
  ];
}

export const SOURCES = { about: aboutSource, skills: skillsSource, experience: experienceSource, work: workSource, contact: contactSource };
export type SourceKind = keyof typeof SOURCES;

/** Plain text of token lines, for the copy button. */
export const plain = (lines: CodeLines) => lines.map((l) => l.map(([, t]) => t).join('')).join('\n');
