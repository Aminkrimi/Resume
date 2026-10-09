import { resume } from '../data/resume';

export function Footer() {
  return (
    <footer className="bg-navy pr-[8mm] pl-[7mm] py-[4mm] text-white">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <dl className="flex flex-wrap gap-x-5 gap-y-2">
          {resume.highlights.map((h) => (
            <div key={h.label} className="flex flex-col">
              <dt className="order-2 text-[6.2pt] tracking-wide text-white/60 uppercase">{h.label}</dt>
              <dd className="order-1 font-display text-[11pt] leading-tight font-bold">{h.value}</dd>
            </div>
          ))}
        </dl>
        <p className="whitespace-nowrap font-display text-[8.4pt] font-semibold text-white/90 italic">“{resume.motto}”</p>
      </div>
    </footer>
  );
}
