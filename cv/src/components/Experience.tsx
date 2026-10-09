import { resume } from '../data/resume';
import { Section } from './SectionTitle';

/** Vertical timeline: a hairline rail with a dot per role; the current role gets the accent dot. */
export function Experience() {
  return (
    <Section title="Experience">
      <ol className="relative ml-1 border-l border-line">
        {resume.experience.map((job, index) => (
          <li key={job.company} className="relative pb-3.5 pl-4 last:pb-0">
            <span
              className={`absolute top-[3.5pt] -left-[4.5px] size-2 rounded-full ring-2 ring-white ${
                index === 0 ? 'bg-accent' : 'bg-navy/30'
              }`}
              aria-hidden="true"
            />
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="font-display text-[9.6pt] font-bold text-navy">
                {job.title}
                <span className="font-semibold text-ink/70"> · {job.company}</span>
                {job.note && (
                  <span className="ml-1.5 rounded-[3px] bg-accent/10 px-1 py-px align-[1px] text-[6.8pt] font-semibold text-accent">
                    {job.note}
                  </span>
                )}
              </h3>
              <span className="shrink-0 text-[7.6pt] font-medium text-muted tabular-nums">{job.period}</span>
            </div>
            <ul className="mt-1 flex flex-col gap-[2px] text-[8.2pt] leading-[1.45] text-ink/85">
              {job.points.map((p) => (
                <li key={p} className="relative pl-3 before:absolute before:top-[0.62em] before:left-0 before:size-[3px] before:rounded-full before:bg-muted">
                  {p}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </Section>
  );
}
