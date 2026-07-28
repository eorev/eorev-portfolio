import Image from "next/image";
import { KualoaParallax } from "./KualoaParallax";
import { PhotoGrid } from "./PhotoGrid";
import { ARCHIVE, EXPERIENCE, PLATES, SITE, STACK, SUMMARY, SYSTEMS } from "@/lib/content";
import {
  ArchiveRows,
  Contact,
  ExperienceRows,
  FieldRows,
  LINKS,
  Photos,
  ResearchBlock,
  SECTION_LIST,
  SectionHead,
  StackRows,
  Summary,
  SystemEntries,
} from "./blocks";

/* Shared chrome ------------------------------------------------------- */

function TopStrip({ className = "" }: { className?: string }) {
  return (
    <nav aria-label="Elsewhere" className={className}>
      <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
        {LINKS.map((l) => (
          <li key={l.label}>
            <a
              href={l.href}
              target={l.href.startsWith("mailto") ? undefined : "_blank"}
              rel="noopener noreferrer"
              className="label transition-colors duration-150 hover:text-signal"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function idx(id: string) {
  return String(SECTION_LIST.findIndex((s) => s.id === id) + 1).padStart(2, "0");
}

/* 01 — Stage ---------------------------------------------------------- */
/* A full-height opening that holds nothing but the name, then the
   document begins underneath. The site gets a front cover.              */

export function LayoutStage() {
  return (
    <>
      <section className="flex min-h-[86svh] flex-col justify-between px-gutter pb-10 pt-8">
        <TopStrip className="flex justify-end" />
        <div className="mx-auto w-full max-w-doc">
          <h1 className="text-[clamp(3rem,13vw,10rem)] font-semibold leading-[0.86] tracking-[-0.045em]">
            Ethan
            <br />
            Orevillo
          </h1>
          <p className="mt-8 max-w-prose text-lead text-ink-mid">{SITE.role}</p>
        </div>
        <div className="mx-auto flex w-full max-w-doc items-end justify-between gap-6">
          <p className="label">{SITE.location}</p>
          <p className="label flex items-center gap-2 text-ink-faint">
            Scroll
            <span aria-hidden="true" className="text-signal">
              ↓
            </span>
          </p>
        </div>
      </section>

      <main className="mx-auto max-w-doc px-gutter pb-24">
        <div className="border-t-2 border-ink pt-10">
          <FieldRows />
        </div>
        <div className="mt-10">
          <Summary />
        </div>

        {(
          [
            ["systems", "Systems", <SystemEntries key="s" />],
            ["research", "Research", <ResearchBlock key="r" />],
            ["experience", "Experience", <ExperienceRows key="e" />],
            ["stack", "Stack", <StackRows key="k" />],
            ["life", "Life", <Photos key="l" mode="wall" />],
            ["archive", "Archive", <ArchiveRows key="a" />],
          ] as const
        ).map(([id, title, node]) => (
          <section key={id} id={id} className="pt-section">
            <SectionHead index={idx(id)} title={title} />
            <div className="mt-7">{node}</div>
          </section>
        ))}

        <footer className="mt-section border-t-2 border-ink pt-8">
          <Contact />
        </footer>
      </main>
    </>
  );
}

/* 02 — Spread --------------------------------------------------------- */
/* An asymmetric editorial grid. Nothing sits in the same column twice:
   titles, prose and metadata each take a different span, and the
   photographs break the margins entirely.                               */

export function LayoutSpread() {
  return (
    <main className="pb-24">
      <div className="mx-auto max-w-[86rem] px-gutter">
        <header className="pt-8 sm:pt-12">
          <TopStrip className="flex justify-end border-b border-rule-strong pb-3" />
          <div className="mt-12 grid grid-cols-12 gap-x-6">
            <h1 className="col-span-12 text-[clamp(2.6rem,9vw,7rem)] font-semibold leading-[0.88] tracking-[-0.04em] lg:col-span-7">
              Ethan
              <br />
              Orevillo
            </h1>
            <div className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-2">
              <p className="text-lead text-ink-mid">{SITE.role}</p>
              <p className="mt-4 font-mono text-meta text-ink-faint">
                {SITE.location}
              </p>
            </div>
          </div>

          <div className="mt-14 grid grid-cols-12 gap-x-6 gap-y-8">
            <div className="col-span-12 lg:col-span-5">
              <FieldRows dense />
            </div>
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <Summary />
            </div>
          </div>
        </header>

        <section id="systems" className="pt-section">
          <SectionHead index={idx("systems")} title="Systems" />
          <ol className="mt-2">
            {SYSTEMS.map((s) => (
              <li key={s.name} className="border-b border-rule py-9">
                <div className="grid grid-cols-12 gap-x-6 gap-y-5">
                  <div className="col-span-12 lg:col-span-4">
                    <div className="flex flex-wrap items-baseline gap-x-3">
                      <span className="label tnum text-signal">{s.index}</span>
                      <h3 className="text-[clamp(1.5rem,3vw,2.1rem)] font-semibold leading-tight tracking-[-0.02em]">
                        {s.name}
                      </h3>
                    </div>
                    {s.org && (
                      <p className="mt-1 font-mono text-meta text-ink-faint">
                        {s.org}
                      </p>
                    )}
                    <p className="mt-3 text-data text-ink-mid">{s.role}</p>
                    <p className="tnum mt-0.5 font-mono text-meta text-ink-faint">
                      {s.period}
                    </p>
                  </div>
                  <p className="col-span-12 text-body text-ink-mid lg:col-span-5">
                    {s.description}
                  </p>
                  <div className="col-span-12 lg:col-span-2 lg:col-start-11">
                    <p className="label mb-2 text-ink-faint">Stack</p>
                    <ul className="space-y-0.5 font-mono text-meta text-ink-mid">
                      {s.stack.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                {s.facts.length > 0 && (
                  <dl className="mt-7 grid grid-cols-2 gap-x-6 border-t border-rule pt-4 lg:grid-cols-4">
                    {s.facts.map((f) => (
                      <div key={f.label}>
                        <dt className="label">{f.label}</dt>
                        <dd className="mt-1 text-data">{f.value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            ))}
          </ol>
        </section>

        <div className="grid grid-cols-12 gap-x-6">
          <section id="research" className="col-span-12 pt-section lg:col-span-7">
            <SectionHead index={idx("research")} title="Research" />
            <div className="pt-8">
              <ResearchBlock />
            </div>
          </section>
          <section
            id="stack"
            className="col-span-12 pt-section lg:col-span-4 lg:col-start-9"
          >
            <SectionHead index={idx("stack")} title="Stack" />
            <div className="mt-2">
              <StackRows narrow />
            </div>
          </section>
        </div>
      </div>

      {/* Photographs break the grid entirely. */}
      <section id="life" className="pt-section">
        <div className="mx-auto max-w-[86rem] px-gutter">
          <SectionHead index={idx("life")} title="Life" />
        </div>
        <div className="mt-8 px-2">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
            {PLATES.map((p, i) => (
              <figure
                key={p.src}
                className={i % 3 === 0 ? "col-span-2 lg:col-span-2" : ""}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  width={p.w}
                  height={p.h}
                  sizes="50vw"
                  className="h-[clamp(11rem,24vw,20rem)] w-full bg-paper-sunk object-cover"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                <figcaption className="mt-2 px-1">
                  <span className="label tnum text-signal">
                    Plate {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="mt-0.5 block font-mono text-meta text-ink-mid">
                    {p.caption}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[86rem] px-gutter">
        <section id="experience" className="pt-section">
          <SectionHead index={idx("experience")} title="Experience" />
          <div className="mt-2">
            <ExperienceRows />
          </div>
        </section>
        <section id="archive" className="pt-section">
          <SectionHead index={idx("archive")} title="Archive" />
          <div className="mt-6">
            <ArchiveRows />
          </div>
        </section>
        <footer className="mt-section border-t-2 border-ink pt-8">
          <Contact />
        </footer>
      </div>
    </main>
  );
}

/* 03 — Index ---------------------------------------------------------- */
/* Everything compressed into one directory. Almost no prose: the whole
   career as scannable rows, the way a reference card reads.             */

export function LayoutIndex() {
  const Row = ({
    k,
    a,
    b,
    c,
    live,
  }: {
    k: string;
    a: string;
    b: string;
    c?: string;
    live?: boolean;
  }) => (
    <div className="row-hover grid grid-cols-1 gap-x-6 border-b border-rule px-1 py-2.5 sm:grid-cols-[8.5rem_13rem_1fr_auto]">
      <span className="label tnum flex items-baseline gap-2 pt-0.5">
        {live && (
          <span aria-hidden="true" className="text-signal">
            ●
          </span>
        )}
        {k}
      </span>
      <span className="text-data font-semibold">{a}</span>
      <span className="text-data text-ink-mid">{b}</span>
      {c && (
        <span className="font-mono text-meta text-ink-faint sm:text-right">
          {c}
        </span>
      )}
    </div>
  );

  return (
    <main className="mx-auto max-w-[80rem] px-gutter pb-24">
      <header className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4 border-b-2 border-ink pb-4 pt-10">
        <div>
          <h1 className="text-[clamp(1.75rem,4vw,2.6rem)] font-semibold leading-none tracking-[-0.03em]">
            Ethan Orevillo
          </h1>
          <p className="mt-2 text-data text-ink-mid">
            {SITE.role}
            <span aria-hidden="true" className="px-2 text-rule-strong">
              /
            </span>
            {SITE.location}
          </p>
        </div>
        <TopStrip />
      </header>

      <p className="mt-6 max-w-prose text-data text-ink-mid">{SUMMARY[1]}</p>

      <section id="systems" className="mt-12">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Systems
        </h2>
        <div className="mt-1">
          {SYSTEMS.map((s) => (
            <Row
              key={s.name}
              k={s.period}
              a={s.name}
              b={s.org ? `${s.role} · ${s.org}` : s.role}
              c={s.stack.slice(0, 4).join(" / ")}
              live={s.status === "live"}
            />
          ))}
        </div>
      </section>

      <section id="research" className="mt-10">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Research
        </h2>
        <div className="mt-1">
          <Row
            k="Ongoing"
            a="Anti-bot research"
            b="Browser and TLS fingerprinting, obfuscated JS, sensor generation"
            c="footlocker / champs"
            live
          />
        </div>
      </section>

      <section id="experience" className="mt-10">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Experience
        </h2>
        <div className="mt-1">
          {EXPERIENCE.map((r) => (
            <Row
              key={`${r.org}-${r.period}`}
              k={r.period}
              a={r.org}
              b={r.title}
              c={`${r.place} · ${r.tags.join(", ")}`}
              live={r.current}
            />
          ))}
        </div>
      </section>

      <section id="stack" className="mt-10">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Stack
        </h2>
        <div className="mt-1 grid grid-cols-1 gap-x-10 md:grid-cols-2">
          {STACK.map((g) => (
            <div
              key={g.group}
              className="grid grid-cols-[7rem_1fr] gap-x-5 border-b border-rule py-2"
            >
              <span className="label pt-0.5">{g.group}</span>
              <span className="font-mono text-meta text-ink">
                {g.items.join(" / ")}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="archive" className="mt-10">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Archive
        </h2>
        <div className="mt-1">
          {ARCHIVE.map((a) => (
            <Row key={a.name} k={a.year} a={a.name} b={a.note} c={a.stack} />
          ))}
        </div>
      </section>

      <section id="life" className="mt-10">
        <h2 className="label border-b border-rule-strong pb-2 text-signal">
          Life
        </h2>
        <div className="mt-4">
          <Photos mode="strip" />
        </div>
      </section>

      <footer className="mt-14 border-t-2 border-ink pt-8">
        <Contact />
      </footer>
    </main>
  );
}

/* 04 — Gallery -------------------------------------------------------- */
/* Image-led. The photographs run full-bleed and set the pace; the text
   sits in a narrow column between them.                                 */

export function LayoutGallery() {
  const lead = PLATES[0];
  const rest = PLATES.slice(1);

  return (
    <main className="pb-24">
      <header className="mx-auto max-w-doc px-gutter pt-8">
        <TopStrip className="flex justify-end border-b border-rule-strong pb-3" />

        {/* Title block.
            Everything else on this page is a ruled, labelled field — the
            ROLE/ALSO/BASED rows, the section numbers, the plate captions. The
            name was the one element that opted out, so it had nothing to sit
            on and read as adrift between the nav rule and the plate.
            Here it is seated on the measure and closed by a rule, the way the
            subject of a spec sheet is a field rather than free text. The
            descriptor moves into the mono label voice and sits at the far
            right so the pair spans the full column instead of trailing off
            mid-line. */}
        <div className="mt-9 flex flex-wrap items-end justify-between gap-x-10 gap-y-3 border-b border-rule pb-4">
          <h1 className="text-display font-semibold">Ethan Orevillo</h1>
          <p className="label pb-1 text-ink-mid">{SITE.role}</p>
        </div>
      </header>

      {/* Close to the title block: the plate is the header's figure, not a
          separate band floating below it. */}
      {lead && <KualoaParallax className="mt-7" caption={lead.caption} />}

      <div className="mx-auto max-w-doc px-gutter">
        <div className="mt-14">
          <FieldRows />
        </div>
        <div className="mt-10">
          <Summary />
        </div>

        <section id="systems" className="pt-section">
          <SectionHead index={idx("systems")} title="Systems" />
          <div className="mt-2">
            <SystemEntries />
          </div>
        </section>
      </div>


      <div className="mx-auto max-w-doc px-gutter">
        <section id="research" className="pt-section">
          <SectionHead index={idx("research")} title="Research" />
          <div className="pt-8">
            <ResearchBlock />
          </div>
        </section>
        <section id="experience" className="pt-section">
          <SectionHead index={idx("experience")} title="Experience" />
          <div className="mt-2">
            <ExperienceRows />
          </div>
        </section>
        <section id="stack" className="pt-section">
          <SectionHead index={idx("stack")} title="Stack" />
          <div className="mt-2">
            <StackRows />
          </div>
        </section>
      </div>

      <section id="life" className="pt-section">
        <div className="mx-auto max-w-doc px-gutter">
          <SectionHead index={idx("life")} title="Life" />
        </div>
        <PhotoGrid plates={rest} />
      </section>

      <div className="mx-auto max-w-doc px-gutter">
        <section id="archive" className="pt-section">
          <SectionHead index={idx("archive")} title="Archive" />
          <div className="mt-6">
            <ArchiveRows />
          </div>
        </section>
        <footer className="mt-section border-t-2 border-ink pt-8">
          <Contact />
        </footer>
      </div>
    </main>
  );
}

/* 05 — Chapters ------------------------------------------------------- */
/* Each section takes its own near-full screen, opened by an oversized
   number. Reads like a deck rather than a page.                         */

export function LayoutChapters() {
  const Chapter = ({
    id,
    title,
    children,
  }: {
    id: string;
    title: string;
    children: React.ReactNode;
  }) => (
    <section
      id={id}
      className="flex min-h-[88svh] flex-col justify-center border-t-2 border-ink px-gutter py-16"
    >
      <div className="mx-auto w-full max-w-doc">
        <div className="flex items-start gap-6 sm:gap-10">
          <span className="tnum select-none font-mono text-[clamp(2.5rem,8vw,6rem)] font-semibold leading-[0.8] text-signal">
            {idx(id)}
          </span>
          <h2 className="pt-1 text-[clamp(1.75rem,4.5vw,3rem)] font-semibold leading-none tracking-[-0.03em]">
            {title}
          </h2>
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );

  return (
    <main className="pb-24">
      <section className="flex min-h-[88svh] flex-col justify-between px-gutter py-8">
        <TopStrip className="flex justify-end" />
        <div className="mx-auto w-full max-w-doc">
          <h1 className="text-[clamp(2.75rem,11vw,8rem)] font-semibold leading-[0.88] tracking-[-0.045em]">
            Ethan
            <br />
            Orevillo
          </h1>
          <p className="mt-7 max-w-prose text-lead text-ink-mid">{SITE.role}</p>
          <div className="mt-10 max-w-prose">
            <Summary short />
          </div>
        </div>
        <div className="mx-auto w-full max-w-doc">
          <FieldRows dense />
        </div>
      </section>

      <Chapter id="systems" title="Systems">
        <SystemEntries />
      </Chapter>
      <Chapter id="research" title="Research">
        <ResearchBlock />
      </Chapter>
      <Chapter id="experience" title="Experience">
        <ExperienceRows />
      </Chapter>
      <Chapter id="stack" title="Stack">
        <StackRows />
      </Chapter>
      <Chapter id="life" title="Life">
        <Photos mode="wall" />
      </Chapter>
      <Chapter id="archive" title="Archive">
        <ArchiveRows />
      </Chapter>

      <footer className="mx-auto max-w-doc border-t-2 border-ink px-gutter pt-8">
        <Contact />
      </footer>
    </main>
  );
}
