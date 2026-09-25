import { cv } from '@/data/cv';
import type { I18n } from '@/lib/i18n';
import { plain } from '@/lib/source';
import type { CodeLines } from './editorArt';
import { CopyCode } from './CopyCode';
import { Icon } from './Icon';

/** The code behind a section, shown when the page is in source view. */
export function SourceView({ file, lines, i }: { file: string; lines: CodeLines; i: I18n }) {
  return (
    <div className="src-view" dir="ltr">
      <div className="src-bar">
        <span className="src-file"><Icon name="braces" />{file}</span>
        <span className="src-meta">{lines.length} lines</span>
        <CopyCode text={plain(lines)} label={i.t(cv.ui.copyCode)} done={i.t(cv.ui.codeCopied)} />
      </div>
      <pre className="src-code"><code>
        {lines.map((l, k) => (
          <span className="ln" key={k}>{l.length ? l.map(([kind, t], j) => <span className={`sx-${kind}`} key={j}>{t}</span>) : ' '}</span>
        ))}
      </code></pre>
    </div>
  );
}
