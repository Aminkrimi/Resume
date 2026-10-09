import { resume } from '../data/resume';
import { Section } from './SectionTitle';
import { TagList } from './Tag';

export function Projects() {
  return (
    <Section title="Featured Projects">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {resume.projects.map((p) => (
          <article key={p.name} className="rounded-md border border-line bg-white px-3 py-2">
            <h3 className="font-display text-[9pt] leading-tight font-bold text-navy">{p.name}</h3>
            <p className="mt-0.5 text-[7.6pt] font-medium text-accent">{p.type}</p>
            {p.impact && (
              <p className="mt-1 text-[7.6pt] leading-snug text-ink/80">
                <span className="font-semibold text-ink">Impact: </span>
                {p.impact}
              </p>
            )}
            <div className="mt-1.5">
              <TagList items={p.stack} tone="accent" />
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
