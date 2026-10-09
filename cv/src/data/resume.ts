/*
 * The résumé reads the portfolio's own data (src/data/cv.ts), so the site and
 * the PDF never drift apart. This file only picks the English text, chooses
 * what fits on one A4 page, and adds a few résumé-only lines.
 */
import { cv } from '../../../src/data/cv';

export type ContactKind = 'email' | 'phone' | 'location' | 'linkedin' | 'github' | 'telegram' | 'portfolio';

export interface Contact {
  kind: ContactKind;
  label: string;
  href?: string;
}

export interface SkillGroup {
  title: string;
  items: string[];
}

export interface Job {
  title: string;
  company: string;
  period: string;
  points: string[];
  tags: string[];
}

export interface Project {
  name: string;
  label?: string;
  desc: string;
  impact?: string;
  stack: string[];
  link?: string;
}

export interface Degree {
  degree: string;
  field: string;
  school: string;
  detail?: string;
}

export interface Highlight {
  value: string;
  label: string;
}

/** Fill in once known; the header shows LinkedIn only when this is set. */
const LINKEDIN: string | null = null;

const p = cv.person;
const short = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const social = (id: string) => p.social.find((s) => s.id === id)!;
const project = (id: string) => cv.projects.find((x) => x.id === id)!;
const years = new Date().getFullYear() - p.startYear;
const toolCount = cv.skills.reduce((n, g) => n + g.items.length, 0) + cv.also.length;

const contacts: Contact[] = [
  { kind: 'email', label: p.email, href: `mailto:${p.email}` },
  { kind: 'phone', label: p.phoneLabel.en, href: `tel:${p.phone}` },
  { kind: 'location', label: p.location.en },
  { kind: 'github', label: short(social('github').url), href: social('github').url },
  LINKEDIN
    ? { kind: 'linkedin', label: short(LINKEDIN), href: LINKEDIN }
    : { kind: 'telegram', label: short(social('telegram').url), href: social('telegram').url },
  { kind: 'portfolio', label: 'aminkrimi.github.io/Resume', href: 'https://aminkrimi.github.io/Resume/en/' },
];

/** Featured on the résumé; Sido is already covered under Experience. */
const featured: Project[] = [
  (() => {
    const g = project('gymplan');
    return {
      name: g.title.en,
      label: 'Full-stack · in active development',
      desc: g.desc.en,
      impact: g.stats!.map((s) => `${s.value.toLocaleString('en')}${s.plus ? '+' : ''} ${s.label.en.split(':')[0]}`).join(' · '),
      stack: g.stack,
      link: g.url,
    };
  })(),
  ...(['smartsearch', 'churn', 'portfolio'] as const).map((id) => {
    const x = project(id);
    return { name: x.title.en === 'This portfolio' ? 'Developer Portfolio' : x.title.en, desc: x.desc.en.replace(/^This bilingual résumé/, 'Bilingual résumé site'), stack: x.stack, link: x.code };
  }),
];

/** Client websites from the portfolio, listed by name in one line. */
const clients = cv.projects.filter((x) => x.url && !x.featured).map((x) => x.title.en);

export const resume = {
  name: p.name.en,
  role: p.role.en,
  focus: ['React', 'Next.js', 'TypeScript'],
  statement: 'Building fast, clean and precise interfaces with React, Next.js and TypeScript.',
  contacts,

  skills: cv.skills.map((g) => ({ title: g.group.en, items: g.items.map((s) => s.name) })) satisfies SkillGroup[],
  also: cv.also,

  strengths: [
    'Clean Code Architecture',
    'Reusable Component Design',
    'Performance & Web Vitals',
    'RTL-first Responsive UI',
    'Problem Solving',
    'Team Collaboration',
    'AI-augmented Workflow',
  ],

  summary: `Front-End Engineer with ${years}+ years of experience shipping interfaces, from company websites to complex multi-module platforms built with React, Next.js and TypeScript. Focused on reusable components with precise types, RTL-first responsive layouts and tight API integration, with an obsessive eye for UI detail and performance. Also works with PostgreSQL, Prisma and ASP.NET, with a machine-learning background.`,

  experience: cv.experience.map((j) => ({
    title: j.title.en,
    company: j.org.en.replace(/ \(.*?\)/, '').replace('Freelance & agency collaborations', 'Freelance & agencies'),
    period: j.period.en.replace(' - ', ' – ').replace('Now', 'Present'),
    points: j.points.en,
    tags: j.tags,
  })) satisfies Job[],

  projects: featured.slice(0, 1),
  openSource: featured.slice(1),
  clients,

  education: cv.education.map((e) => ({
    degree: 'B.Sc.',
    field: e.title.en,
    school: e.org.en,
    detail: e.note.en,
  })) satisfies Degree[],

  highlights: [
    { value: `${years}+`, label: 'Years shipping' },
    { value: `${cv.projects.length}`, label: 'Projects shipped' },
    { value: `${toolCount}+`, label: 'Tools in the kit' },
    { value: 'ML', label: 'Data & ML background' },
  ] satisfies Highlight[],

  motto: 'Building products, not just interfaces.',
};
