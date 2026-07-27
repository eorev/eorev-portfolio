import type { ReactNode } from "react";
import type { Status } from "@/lib/content";

/* ------------------------------------------------------------------ */
/* Section: a numbered division of the document.                       */
/* ------------------------------------------------------------------ */

export function Section({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-8 pt-section">
      <header>
        <div className="flex items-baseline gap-3">
          <span className="label tnum text-signal">{index}</span>
          <h2 className="text-section font-semibold">{title}</h2>
        </div>
        <div className="section-rule mt-3" />
      </header>
      {children}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* FieldRow: mono label in a fixed left column, content on the right.  */
/* ------------------------------------------------------------------ */

export function FieldRow({
  label,
  children,
  className = "",
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-2.5 sm:grid-cols-[8.5rem_1fr] ${className}`}
    >
      <dt className="label pt-1">{label}</dt>
      <dd className="text-data text-ink sm:text-body">{children}</dd>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* StatusMarker: colour is never the only carrier. Glyph + word too.   */
/* ------------------------------------------------------------------ */

const STATUS: Record<Status, { glyph: string; word: string; tone: string }> = {
  live: { glyph: "●", word: "Live", tone: "text-signal" },
  development: { glyph: "◐", word: "In development", tone: "text-ink-faint" },
  ongoing: { glyph: "●", word: "Ongoing", tone: "text-signal" },
  archived: { glyph: "○", word: "Archived", tone: "text-ink-faint" },
};

export function StatusMarker({ status }: { status: Status }) {
  const { glyph, word, tone } = STATUS[status];
  return (
    <span className="label inline-flex items-center gap-1.5 whitespace-nowrap text-ink-mid">
      <span aria-hidden="true" className={tone}>
        {glyph}
      </span>
      {word}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Sep: inline slash on wide screens. Below sm the pair stacks and the */
/* slash is dropped, so it can never orphan at the end of a line.      */
/* ------------------------------------------------------------------ */

export function Sep() {
  return (
    <span aria-hidden="true" className="hidden px-2 text-rule-strong sm:inline">
      /
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* StackString: the technologies, set as data rather than as pills.    */
/* ------------------------------------------------------------------ */

export function StackString({ items }: { items: readonly string[] }) {
  return (
    <p className="font-mono text-meta text-ink-mid">
      {items.map((item, i) => (
        <span key={item}>
          {i > 0 && <span className="px-1.5 text-rule-strong">/</span>}
          {item}
        </span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* ExternalLink: ruled underline, trailing mark. No icon dependency.   */
/* ------------------------------------------------------------------ */

export function ExternalLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`doc-link ${className}`}
    >
      {children}
      <span aria-hidden="true" className="ml-1 text-ink-faint">
        ↗
      </span>
    </a>
  );
}
