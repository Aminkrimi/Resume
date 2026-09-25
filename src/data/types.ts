export type Lang = 'fa' | 'en';
export type T = Record<Lang, string>;
export type TList = Record<Lang, string[]>;

export type IconName =
  | 'sun' | 'moon' | 'command' | 'search' | 'arrow' | 'copy' | 'check' | 'download' | 'github' | 'telegram'
  | 'instagram' | 'mail' | 'phone' | 'pin' | 'code' | 'layout' | 'gauge' | 'chart' | 'camera' | 'cpu' | 'music'
  | 'palette' | 'bolt' | 'users' | 'brain' | 'tree' | 'film' | 'lock' | 'globe' | 'up' | 'grad' | 'terminal'
  | 'file' | 'branch' | 'react';

export interface Social { id: IconName; label: string; url: string; handle: string }
export interface Skill { name: string; level: 1 | 2 | 3 | 4 | 5 }
export interface Job { period: T; title: T; org: T; current?: boolean; points: TList; tags: string[] }
export interface Project {
  id: string;
  cat: string[];
  featured?: boolean;
  title: T;
  desc: T;
  img?: string;
  url?: string;
  code?: string;
  stack: string[];
  mock?: boolean;
  glyph?: IconName;
}

export interface CV {
  person: {
    name: T; first: T; last: T; role: T; roles: TList; location: T; timezone: string;
    email: string; phone: string; phoneLabel: T; available: boolean; availability: T; startYear: number; social: Social[];
  };
  ui: Record<string, T | Record<string, T>> & {
    nav: Record<'about' | 'skills' | 'experience' | 'work' | 'contact', T>;
    palette: Record<string, T>;
  };
  about: {
    paragraphs: T[];
    personality: { code: string; label: T; desc: T }[];
    interests: ({ icon: IconName } & T)[];
  };
  services: { icon: IconName; title: T; desc: T }[];
  skills: { group: T; items: Skill[] }[];
  also: string[];
  marquee: string[];
  experience: Job[];
  education: { period: T; title: T; org: T; note: T }[];
  projects: Project[];
  filters: ({ id: string } & Partial<T>)[];
}
