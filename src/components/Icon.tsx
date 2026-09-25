import {
  ArrowLeft, ArrowUp, ArrowUpRight, BookOpen, Brain, BracketsCurly, CursorClick, GitBranch, GitCommit, Play, Star, Camera, ChartLineUp, Check, Code, Command, Copy, Cpu, DownloadSimple, EnvelopeSimple,
  Gauge, GithubLogo, Globe, GraduationCap, InstagramLogo, Layout, Lightning, MagnifyingGlass, MapPin, Moon, MusicNotes,
  Palette, Phone, Sun, TelegramLogo, TerminalWindow, TreeStructure, UsersThree, X,
} from '@phosphor-icons/react/dist/ssr';
import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import type { IconName } from '@/data/types';

const ICONS: Record<IconName, PhosphorIcon> = {
  sun: Sun, moon: Moon, command: Command, search: MagnifyingGlass, arrow: ArrowUpRight, copy: Copy, check: Check,
  download: DownloadSimple, github: GithubLogo, telegram: TelegramLogo, instagram: InstagramLogo, mail: EnvelopeSimple,
  phone: Phone, pin: MapPin, code: Code, layout: Layout, gauge: Gauge, chart: ChartLineUp, camera: Camera, cpu: Cpu,
  music: MusicNotes, palette: Palette, bolt: Lightning, users: UsersThree, brain: Brain, tree: TreeStructure,
  globe: Globe, up: ArrowUp, grad: GraduationCap, terminal: TerminalWindow, close: X,
  braces: BracketsCurly, cursor: CursorClick, branch: GitBranch, commit: GitCommit, play: Play, star: Star, book: BookOpen, back: ArrowLeft,
};

/** Phosphor icons, one family and one weight across the site. */
export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const C = ICONS[name];
  return <C className={`i ${className}`} weight="regular" aria-hidden="true" />;
}
