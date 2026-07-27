import { SITE, SUMMARY } from "@/lib/content";
import { SECTIONS } from "@/lib/sections";
import { Ornament } from "./Ornament";
import { Sep } from "./Primitives";

const LINKS = [
  { label: "GitHub", href: SITE.github },
  { label: "LinkedIn", href: SITE.linkedin },
  { label: "Email", href: `mailto:${SITE.email}` },
];

export function Masthead() {
  return (
    <header className="pt-8 sm:pt-12">
      {/* Document strip: where to find him, above everything else. */}
      <div className="flex flex-wrap items-baseline justify-end gap-x-6 gap-y-2 border-b border-rule-strong pb-3">
        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("mailto") ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className="label transition-colors duration-150 ease-out-quart hover:text-signal"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="relative">
        <h1 className="mt-10 text-display font-semibold sm:mt-14">
          Ethan
          <br />
          Orevillo
        </h1>
        <Ornament slot="masthead" />
      </div>

      <p className="mt-5 max-w-prose text-lead text-ink-mid">{SITE.role}</p>

      {/* Identification block: the facts a skimmer needs in ten seconds. */}
      <dl className="mt-10 border-t border-rule-strong">
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-3 sm:grid-cols-[8.5rem_1fr]">
          <dt className="label pt-1">Role</dt>
          <dd className="text-data sm:text-body">
            Global Tech &amp; Operations Rotation Associate
            <Sep />
            <span className="block text-ink-mid sm:inline">Prudential Financial</span>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-3 sm:grid-cols-[8.5rem_1fr]">
          <dt className="label pt-1">Also</dt>
          <dd className="text-data sm:text-body">
            Co-Owner, Lead Backend Engineer
            <Sep />
            <span className="block text-ink-mid sm:inline">BurntBase</span>
          </dd>
        </div>
        <div className="grid grid-cols-1 gap-x-6 gap-y-1 border-b border-rule py-3 sm:grid-cols-[8.5rem_1fr]">
          <dt className="label pt-1">Based</dt>
          <dd className="text-data sm:text-body">{SITE.location}</dd>
        </div>
      </dl>

      <div className="mt-10 max-w-prose space-y-4">
        {SUMMARY.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="text-body text-ink-mid">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Table of contents. The document is long; give it a jump list. */}
      <nav
        aria-label="Contents"
        className="no-print mt-12 border-y border-rule py-3"
      >
        <ul className="flex flex-wrap items-baseline gap-x-7 gap-y-2.5">
          <li className="label text-ink-faint">Contents</li>
          {SECTIONS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="group inline-flex items-baseline gap-1.5 font-mono text-meta text-ink-mid transition-colors duration-150 ease-out-quart hover:text-ink"
              >
                <span className="tnum text-signal">{item.index}</span>
                <span className="group-hover:underline group-hover:decoration-rule-strong group-hover:underline-offset-4">
                  {item.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
