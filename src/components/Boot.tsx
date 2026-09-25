/**
 * "npm run dev" intro, animated purely in CSS so it never blocks hydration.
 * The inline theme script adds .booted (skip) after the first view per session.
 */
export function Boot() {
  return (
    <div className="boot" aria-hidden="true">
      <pre>
        <div><span className="dim">~/portfolio</span> <span className="acc">$</span> npm run dev</div>
        <div><span className="dim">&gt; amin-karimi@latest dev</span></div>
        <div><span className="acc">▲</span> Next.js · ready in <span className="acc">312ms</span></div>
        <div><span className="ok">✓</span> Compiled successfully</div>
      </pre>
    </div>
  );
}
