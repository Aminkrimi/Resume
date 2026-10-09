export type Lang = 'fa' | 'en';
export type T = Record<Lang, string>;
export type TList = Record<Lang, string[]>;

export type IconName =
  | 'sun' | 'moon' | 'command' | 'search' | 'arrow' | 'copy' | 'check' | 'download' | 'github' | 'telegram'
  | 'instagram' | 'mail' | 'phone' | 'pin' | 'code' | 'layout' | 'gauge' | 'chart' | 'camera' | 'cpu' | 'music'
  | 'palette' | 'bolt' | 'users' | 'brain' | 'tree' | 'globe' | 'up' | 'grad' | 'terminal' | 'close' | 'braces' | 'cursor' | 'branch' | 'commit' | 'play' | 'star' | 'book' | 'back';

export interface Social { id: IconName; label: string; url: string; handle: string }
export interface Skill { name: string; level: 1 | 2 | 3 | 4 | 5 }
/** `lane` 0 is main; other lanes are branches that fork from main when the job started. */
export interface Job { period: T; title: T; org: T; current?: boolean; branch: string; lane: number; since: number; points: TList; tags: string[] }
export interface Project {
  id: string;
  featured?: boolean;
  /** Label above a featured project's title; defaults to ui.featured. */
  tag?: T;
  title: T;
  desc: T;
  /** Screenshot under /public. If the file is missing the card falls back to its text layout. */
  img?: string;
  url?: string;
  code?: string;
  stack: string[];
  highlights?: T[];
  /** Headline numbers for a featured project. */
  stats?: { value: number; plus?: boolean; label: T }[];
  /** Shown instead of a link when the project has no public URL or repository. */
  note?: T;
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
    playExamples: Record<'skills' | 'years' | 'tech' | 'hire', T>;
    api: Record<string, T>;
  };
  about: {
    paragraphs: T[];
    personality: { code: string; label: T; desc: T }[];
    interests: ({ icon: IconName } & T)[];
  };
  services: { icon: IconName; title: T; desc: T }[];
  skills: { group: T; items: Skill[] }[];
  also: string[];
  experience: Job[];
  education: { degree: string; period: T; title: T; org: T; note?: T }[];
  projects: Project[];
}
