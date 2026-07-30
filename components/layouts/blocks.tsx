import Image from "next/image";
import {
  ARCHIVE,
  EXPERIENCE,
  LIFE_LEAD,
  PLATES,
  RESEARCH,
  SITE,
  STACK,
  SUMMARY,
  SYSTEMS,
} from "@/lib/content";
import { TrackedLink } from "@/components/TrackedLink";

/**
 * Content blocks shared by every layout study. The design system is fixed —
 * same paper, same vermilion, same Archivo and Spline Sans Mono, same rules
 * and mono labels. Only the arrangement changes between layouts, so these
 * blocks stay layout-agnostic and take just enough props to adapt.
 */

export function SectionHead({
  index,
  title,
  className = "",
}: {
  index: string;
  title: string;
  className?: string;
}) {
  return (
    <header className={className}>
      <div className="flex items-baseline gap-3">
        <span className="label tnum text-signal">{index}</span>
        <h2 className="text-section font-semibold">{title}</h2>
      </div>
      <div className="section-rule mt-3" />
    </header>
  );
}

export function FieldRows({ dense = false }: { dense?: boolean }) {
  const cols = dense ? "sm:grid-cols-[6.5rem_1fr]" : "sm:grid-cols-[8.5rem_1fr]";
  const rows = [
    ["Role", "Global Tech & Operations Rotation Associate", "Prudential Financial"],
    ["Also", "Co-Owner, Lead Backend Engineer", "BurntBase"],
    ["Based", SITE.location, ""],
  ] as const;
  return (
    <dl className="border-t border-rule-strong">
      {rows.map(([k, v, org]) => (
        <div
          key={k}
          className={`grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-3 ${cols}`}
        >
          <dt className="label pt-1">{k}</dt>
          <dd className="text-data">
            {v}
            {org && (
              <>
                <span
                  aria-hidden="true"
                  className="hidden px-2 text-rule-strong sm:inline"
                >
                  /
                </span>
                <span className="block text-ink-mid sm:inline">{org}</span>
              </>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Summary({ short = false }: { short?: boolean }) {
  const paras = short ? SUMMARY.slice(0, 1) : SUMMARY;
  return (
    <div className="max-w-prose space-y-4">
      {paras.map((p) => (
        <p key={p.slice(0, 20)} className="text-body text-ink-mid">
          {p}
        </p>
      ))}
    </div>
  );
}

export function SystemEntries({ stacked = false }: { stacked?: boolean }) {
  return (
    <ol>
      {SYSTEMS.map((s) => (
        <li
          key={s.name}
          className="border-b border-rule py-7 last:border-b-0 sm:py-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="label tnum text-signal">{s.index}</span>
              <h3 className="text-entry font-semibold">{s.name}</h3>
              {s.org && (
                <>
                  <span aria-hidden="true" className="text-rule-strong">
                    /
                  </span>
                  <span className="font-mono text-meta text-ink-faint">
                    {s.org}
                  </span>
                </>
              )}
            </div>
            <span className="label whitespace-nowrap text-ink-mid">
              <span
                aria-hidden="true"
                className={s.status === "live" ? "text-signal" : "text-ink-faint"}
              >
                {s.status === "live" ? "●" : "◐"}
              </span>{" "}
              {s.status === "live" ? "Live" : "In development"}
            </span>
          </div>

          <p className="mt-1.5 text-data text-ink-mid">
            {s.role}
            <span aria-hidden="true" className="px-2 text-rule-strong">
              /
            </span>
            <span className="tnum whitespace-nowrap">{s.period}</span>
          </p>

          <p className="mt-4 font-mono text-meta text-ink-mid">
            {s.stack.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="px-1.5 text-rule-strong">/</span>}
                {t}
              </span>
            ))}
          </p>

          <p className="mt-4 max-w-prose text-body text-ink-mid">
            {s.description}
          </p>

          {s.facts.length > 0 && (
            <dl
              className={`mt-5 border-t border-rule ${
                stacked
                  ? ""
                  : "sm:grid sm:grid-cols-2 sm:gap-x-8 sm:border-t-0 sm:pt-0"
              }`}
            >
              {s.facts.map((f) => (
                <div
                  key={f.label}
                  className="grid grid-cols-1 gap-x-6 border-b border-rule py-2 sm:grid-cols-[7rem_1fr]"
                >
                  <dt className="label pt-0.5">{f.label}</dt>
                  <dd className="text-data">{f.value}</dd>
                </div>
              ))}
            </dl>
          )}
        </li>
      ))}
    </ol>
  );
}

export function ResearchBlock() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-entry font-semibold">{RESEARCH.title}</h3>
        <span className="label whitespace-nowrap text-ink-mid">
          <span aria-hidden="true" className="text-signal">
            ●
          </span>{" "}
          Ongoing
        </span>
      </div>
      <div className="mt-4 max-w-prose space-y-4">
        <p className="text-lead text-ink">{RESEARCH.lead}</p>
        <p className="text-body text-ink-mid">{RESEARCH.body}</p>
      </div>
      <dl className="mt-6 border-t border-rule">
        {RESEARCH.fields.map((f) => (
          <div
            key={f.label}
            className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-2.5 sm:grid-cols-[8.5rem_1fr]"
          >
            <dt className="label pt-1">{f.label}</dt>
            <dd className="text-data">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ExperienceRows({ compact = false }: { compact?: boolean }) {
  return (
    <ul>
      {EXPERIENCE.map((r) => (
        <li key={`${r.org}-${r.period}`} className="row-hover border-b border-rule">
          <div
            className={`grid grid-cols-1 gap-x-8 gap-y-1.5 px-1 py-4 ${
              compact ? "" : "sm:grid-cols-[10.5rem_1fr]"
            }`}
          >
            <p className="label tnum flex items-baseline gap-2 pt-1">
              {r.current && (
                <span aria-hidden="true" className="text-signal">
                  ●
                </span>
              )}
              <span>{r.period}</span>
            </p>
            <div>
              <div className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2.5">
                <h3 className="text-base font-semibold leading-snug">{r.org}</h3>
                <span
                  aria-hidden="true"
                  className="hidden text-rule-strong sm:inline"
                >
                  /
                </span>
                <p className="text-data text-ink-mid">{r.title}</p>
              </div>
              <p className="mt-1.5 font-mono text-meta text-ink-faint">
                {r.place}
                <span className="px-1.5 text-rule-strong">·</span>
                {r.tags.join(", ")}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export function StackRows({ narrow = false }: { narrow?: boolean }) {
  return (
    <dl className="border-t-0">
      {STACK.map((g) => (
        <div
          key={g.group}
          className={`grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-3 ${
            narrow ? "" : "sm:grid-cols-[8.5rem_1fr]"
          }`}
        >
          <dt className="label pt-1">{g.group}</dt>
          <dd className="font-mono text-meta leading-relaxed text-ink">
            {g.items.map((it, i) => (
              <span key={it}>
                {i > 0 && <span className="px-1.5 text-rule-strong">/</span>}
                {it}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Photos({
  mode = "wall",
}: {
  mode?: "wall" | "strip" | "column";
}) {
  if (PLATES.length === 0) return null;

  const list =
    mode === "strip"
      ? "flex snap-x gap-1 overflow-x-auto pb-2"
      : mode === "column"
        ? "space-y-7"
        : "columns-2 gap-1 lg:columns-3";

  return (
    <>
      <p className="max-w-prose text-body text-ink-mid">{LIFE_LEAD}</p>
      <ol className={`mt-7 ${list}`}>
        {PLATES.map((p, i) => (
          <li
            key={p.src}
            className={
              mode === "strip"
                ? "shrink-0 snap-start"
                : mode === "column"
                  ? ""
                  : "mb-6 break-inside-avoid"
            }
          >
            <figure>
              <Image
                src={p.src}
                alt={p.alt}
                width={p.w}
                height={p.h}
                sizes={mode === "column" ? "(max-width:768px) 90vw, 34rem" : "33vw"}
                className={
                  mode === "strip"
                    ? "h-[clamp(13rem,26vw,17rem)] w-auto max-w-none bg-paper-sunk object-cover"
                    : "h-auto w-full bg-paper-sunk"
                }
                loading={i < 3 ? "eager" : "lazy"}
              />
              <figcaption className="mt-2.5">
                <span className="label tnum text-signal">
                  Plate {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block font-mono text-meta text-ink-mid">
                  {p.caption}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </>
  );
}

export function ArchiveRows() {
  return (
    <ul className="border-t-0">
      {ARCHIVE.map((a) => (
        <li key={a.name} className="row-hover border-b border-rule">
          <TrackedLink
            href={a.href}
            destination="archive_project"
            surface="archive"
            label={a.name}
            className="group grid grid-cols-1 gap-x-8 gap-y-1 px-1 py-3.5 sm:grid-cols-[4.5rem_1fr]"
          >
            <p className="label tnum pt-1">{a.year}</p>
            <div>
              <h3 className="text-base font-semibold leading-snug transition-colors duration-150 group-hover:text-signal">
                {a.name}
              </h3>
              <p className="mt-1 text-data text-ink-mid">{a.note}</p>
              <p className="mt-1 font-mono text-meta text-ink-faint">{a.stack}</p>
            </div>
          </TrackedLink>
        </li>
      ))}
    </ul>
  );
}

export function Contact() {
  return (
    <div className="grid grid-cols-1 gap-x-12 gap-y-8 sm:grid-cols-2">
      <section>
        <h2 className="label">Education</h2>
        <p className="mt-3 text-base font-semibold">University of Delaware</p>
        <p className="mt-1 text-data text-ink-mid">
          BS, Computer Science
          <span aria-hidden="true" className="px-2 text-rule-strong">
            /
          </span>
          <span className="tnum">2021 – 2025</span>
        </p>
        <p className="mt-2 font-mono text-meta text-ink-faint">
          UD CTF, ACM, CS for Social Good, Alpha Kappa Psi
        </p>
      </section>
      <section>
        <h2 className="label">Contact</h2>
        <ul className="mt-3 space-y-2 text-data">
          <li>
            <TrackedLink
              href={`mailto:${SITE.email}`}
              destination="email"
              surface="footer"
              label={SITE.email}
              className="doc-link"
            >
              {SITE.email}
            </TrackedLink>
          </li>
          <li>
            <TrackedLink
              href={SITE.github}
              destination="github"
              surface="footer"
              label="github.com/eorev"
              className="doc-link"
            >
              github.com/eorev
            </TrackedLink>
          </li>
        </ul>
      </section>
    </div>
  );
}

/* `destination` is what the analytics groups on. It is declared beside the
   href rather than derived from the label, so renaming the visible text
   cannot silently split one event into two. */
export const LINKS = [
  { label: "GitHub", href: SITE.github, destination: "github" },
  { label: "LinkedIn", href: SITE.linkedin, destination: "linkedin" },
  { label: "Email", href: `mailto:${SITE.email}`, destination: "email" },
] as const;

export const SECTION_LIST = [
  { id: "systems", title: "Systems" },
  { id: "research", title: "Research" },
  { id: "experience", title: "Experience" },
  { id: "stack", title: "Stack" },
  { id: "life", title: "Life" },
  { id: "archive", title: "Archive" },
];
