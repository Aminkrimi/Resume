import { Icon } from './Icon';
import { pad } from '@/lib/i18n';

export const FILES = { about: 'about.md', skills: 'skills.json', experience: 'experience.log', work: 'projects/', contact: 'contact.sh' } as const;
export type SectionId = keyof typeof FILES;
export const SECTIONS = Object.keys(FILES) as SectionId[];

export function SecLabel({ index, id, label }: { index: number; id: SectionId; label: string }) {
  return (
    <div className="sec-label">
      <span className="num">{pad(index)}</span>
      <span className="file"><Icon name="file" />{FILES[id]}</span>
      <span className="rule" />
      <span>{label}</span>
    </div>
  );
}

export function SectionHead({ index, id, label, title, lead }: { index: number; id: SectionId; label: string; title: string; lead?: string }) {
  return (
    <div className="sec-head reveal">
      <SecLabel index={index} id={id} label={label} />
      <h2 className="sec-title">{title}</h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </div>
  );
}
