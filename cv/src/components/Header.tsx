import { resume } from '../data/resume';
import { Icon } from './Icon';

export function Header() {
  return (
    <header className="border-b border-line px-[7mm] pt-[9mm] pb-[5mm]">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="font-display text-[26pt] leading-none font-extrabold tracking-[-0.02em] text-navy">
            {resume.name}
          </h1>
          <p className="mt-2 flex items-center gap-2.5 font-display text-[11.5pt] font-semibold text-ink">
            {resume.role}
            <span className="h-3 w-px bg-line" aria-hidden="true" />
            <span className="text-[10pt] font-medium text-accent">{resume.focus.join('  |  ')}</span>
          </p>
        </div>
        <p className="max-w-[78mm] text-right text-[8.4pt] leading-snug text-muted">{resume.statement}</p>
      </div>

      <ul className="mt-3.5 grid grid-cols-1 gap-x-4 gap-y-1 text-[7.6pt] sm:grid-cols-3 print:grid-cols-3 text-ink/80">
        {resume.contacts.map((c) => (
          <li key={c.kind} className="flex items-center gap-1.5">
            <Icon name={c.kind} className="size-[8.5pt] text-accent" />
            {c.href ? (
              <a href={c.href} className="hover:text-accent">
                {c.label}
              </a>
            ) : (
              c.label
            )}
          </li>
        ))}
      </ul>
    </header>
  );
}
