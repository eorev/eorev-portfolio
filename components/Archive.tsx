import { ARCHIVE } from "@/lib/content";

export function Archive() {
  return (
    <>
      <p className="mt-6 max-w-prose text-data text-ink-faint">
        Earlier work, kept for the record. Most of it is coursework or hackathon
        builds from 2023 and 2024.
      </p>

      <ul className="mt-6 border-t border-rule">
        {ARCHIVE.map((item) => (
          <li key={item.name} className="row-hover border-b border-rule">
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 gap-x-8 gap-y-1 px-1 py-3.5 sm:grid-cols-[4.5rem_1fr]"
            >
              <p className="label tnum pt-1">{item.year}</p>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-2.5">
                  <h3 className="text-base font-semibold leading-snug transition-colors duration-150 ease-out-quart group-hover:text-signal">
                    {item.name}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="font-mono text-meta text-ink-faint opacity-0 transition-opacity duration-150 ease-out-quart group-hover:opacity-100"
                  >
                    ↗
                  </span>
                </div>
                <p className="mt-1 text-data text-ink-mid">{item.note}</p>
                <p className="mt-1 font-mono text-meta text-ink-faint">
                  {item.stack}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
