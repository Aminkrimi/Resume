export function Tag({ children, tone = 'default' }: { children: string; tone?: 'default' | 'accent' }) {
  const styles =
    tone === 'accent'
      ? 'border-accent/20 bg-accent/[0.06] text-accent'
      : 'border-line bg-white text-ink/80';
  return (
    <li className={`rounded-[4px] border px-1.5 py-[1.5px] text-[7.4pt] leading-[1.35] font-medium ${styles}`}>
      {children}
    </li>
  );
}

export function TagList({ items, tone }: { items: string[]; tone?: 'default' | 'accent' }) {
  return (
    <ul className="flex flex-wrap gap-1">
      {items.map((item) => (
        <Tag key={item} tone={tone}>
          {item}
        </Tag>
      ))}
    </ul>
  );
}
