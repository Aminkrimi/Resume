import { resume } from '../data/resume';
import { Section } from './SectionTitle';

export function Projects() {
  return (
    <Section title="Featured Projects">
      <div className="flex flex-col gap-2">
        {resume.projects.map((p) => (
          <article key={p.name} className="rounded-md border border-line bg-white px-3 py-2">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[9.2pt] font-bold text-navy">{p.name}</h3>
              {p.label && <span className="text-[7.2pt] font-medium text-accent">{p.label}</span>}
            </div>
            <p className="mt-0.5 text-[7.8pt] leading-snug text-ink/85">{p.desc}</p>
            {p.impact && (
              <p className="mt-1 text-[7.6pt] leading-snug text-ink/80">
                <span className="font-semibold text-ink">Impact: </span>
                {p.impact}
              </p>
            )}
            <p className="mt-1 text-[7.2pt] font-medium text-accent">{p.stack.join(' · ')}</p>
          </article>
        ))}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 print:grid-cols-3">
          {resume.openSource.map((p) => (
            <article key={p.name} className="rounded-md border border-line bg-white px-2.5 py-1.5">
              <h3 className="flex items-baseline justify-between gap-1 font-display text-[8.2pt] font-bold whitespace-nowrap text-navy">
                {p.name}
                {p.link && (
                  <a href={p.link} className="text-[7pt] font-medium text-accent" aria-label={`${p.name} on GitHub`}>
                    ↗
                  </a>
                )}
              </h3>
              <p className="text-[7.2pt] leading-snug text-ink/80">
                {p.stack.map((s, i) => (
                  <span key={s}>
                    {i > 0 && ' · '}
                    <span className="whitespace-nowrap">{s}</span>
                  </span>
                ))}
              </p>
            </article>
          ))}
        </div>
        <p className="text-[7.6pt] leading-snug text-ink/80">
          <span className="font-semibold text-ink">Client websites: </span>
          {resume.clients.join(' · ')}
        </p>
      </div>
    </Section>
  );
}
