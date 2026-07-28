import { SYSTEMS } from "@/lib/content";
import { ExternalLink, Sep, StackString, StatusMarker } from "./Primitives";

export function Systems() {
  return (
    <ol className="mt-2">
      {SYSTEMS.map((system) => (
        <li
          key={system.name}
          className="border-b border-rule py-8 last:border-b-0 sm:py-10"
        >
          <div>
            <div>
              {/* Numbered the same way sections are, so the hierarchy reads. */}
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="label tnum text-signal">{system.index}</span>
                  <h3 className="text-entry font-semibold">{system.name}</h3>
                  {system.org && (
                    <>
                      <span aria-hidden="true" className="text-rule-strong">
                        /
                      </span>
                      <span className="font-mono text-meta text-ink-faint">
                        {system.org}
                      </span>
                    </>
                  )}
                </div>
                <StatusMarker status={system.status} />
              </div>

              <p className="mt-1.5 text-data text-ink-mid">
                {system.role}
                <Sep />
                <span className="tnum block whitespace-nowrap sm:inline">
                  {system.period}
                </span>
              </p>

              <div className="mt-4">
                <StackString items={system.stack} />
              </div>
              <p className="mt-5 max-w-prose text-body text-ink-mid">
                {system.description}
              </p>

              {/* Facts as a ruled sub-table, not as stat tiles. */}
              <dl className="mt-6 border-t border-rule">
                {system.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid grid-cols-1 gap-x-6 gap-y-0.5 border-b border-rule py-2 sm:grid-cols-[8.5rem_1fr]"
                  >
                    <dt className="label pt-0.5">{fact.label}</dt>
                    <dd className="text-data text-ink">{fact.value}</dd>
                  </div>
                ))}
              </dl>

              {system.href && (
                <p className="mt-5 font-mono text-meta">
                  <ExternalLink href={system.href}>
                    {system.hrefLabel ?? system.href}
                  </ExternalLink>
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}
