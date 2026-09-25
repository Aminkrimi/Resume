/** Section ids double as anchor links, nav targets and terminal "files". Keep them stable. */
export const FILES = { about: 'about.md', skills: 'skills.json', experience: 'experience.log', work: 'projects/', contact: 'contact.sh' } as const;
export type SectionId = keyof typeof FILES;
export const SECTIONS = Object.keys(FILES) as SectionId[];

export function SectionHead({ title, lead }: { title: string; lead?: string }) {
  return (
    <header className="sec-head reveal">
      <h2 className="sec-title">{title}</h2>
      {lead && <p className="sec-lead">{lead}</p>}
    </header>
  );
}
