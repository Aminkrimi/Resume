import { resume } from '../data/resume';
import { Icon } from './Icon';
import { Section } from './SectionTitle';
import { TagList } from './Tag';

export function Sidebar() {
  return (
    <aside className="flex flex-col gap-[5mm] bg-surface px-[7mm] py-[6mm] md:border-r md:border-line">
      <Section title="Core Skills">
        <div className="flex flex-col gap-3">
          {resume.skills.map((group) => (
            <div key={group.title}>
              <h3 className="mb-1.5 text-[7.4pt] font-semibold tracking-wide text-muted uppercase">{group.title}</h3>
              <TagList items={group.items} />
            </div>
          ))}
          <div>
            <h3 className="mb-1.5 text-[7.4pt] font-semibold tracking-wide text-muted uppercase">Also</h3>
            <TagList items={resume.also} />
          </div>
        </div>
      </Section>

      <Section title="Engineering Strengths">
        <ul className="flex flex-col gap-1.5 text-[8.4pt] text-ink">
          {resume.strengths.map((s) => (
            <li key={s} className="flex items-center gap-2">
              <span className="grid size-[11pt] place-items-center rounded-full bg-accent/10 text-accent">
                <Icon name="check" className="size-[7pt]" />
              </span>
              {s}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Education">
        {resume.education.map((d) => (
          <div key={d.field}>
            <p className="font-display text-[8.8pt] font-bold text-navy">
              {d.degree} {d.field}
            </p>
            <p className="text-[8pt] text-ink">{d.school}</p>
            {d.detail && <p className="mt-0.5 text-[7.4pt] leading-snug text-muted">{d.detail}</p>}
          </div>
        ))}
      </Section>
    </aside>
  );
}
