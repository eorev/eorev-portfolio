import { EXPERIENCE } from "@/lib/content";

export function Experience() {
  // No top border here: the section rule above already closes this edge.
  return (
    <ul className="mt-2">
      {EXPERIENCE.map((role) => (
        <li
          key={`${role.org}-${role.period}`}
          className="row-hover border-b border-rule"
        >
          <div className="grid grid-cols-1 gap-x-8 gap-y-1.5 px-1 py-4 sm:grid-cols-[10.5rem_1fr] sm:py-5">
            <p className="label tnum flex items-baseline gap-2 pt-1">
              {role.current && (
                <span aria-hidden="true" className="text-signal">
                  ●
                </span>
              )}
              <span>{role.period}</span>
            </p>

            <div>
              <div className="flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2.5">
                <h3 className="text-base font-semibold leading-snug">
                  {role.href ? (
                    <a
                      href={role.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="doc-link"
                    >
                      {role.org}
                    </a>
                  ) : (
                    role.org
                  )}
                </h3>
                <span aria-hidden="true" className="hidden text-rule-strong sm:inline">
                  /
                </span>
                <p className="text-data text-ink-mid">{role.title}</p>
              </div>

              <p className="mt-1.5 font-mono text-meta text-ink-faint">
                {role.place}
                <span className="px-1.5 text-rule-strong">·</span>
                {role.tags.join(", ")}
              </p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
