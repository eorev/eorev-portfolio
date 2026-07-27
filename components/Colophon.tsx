import { EDUCATION, SITE } from "@/lib/content";
import { Ornament } from "./Ornament";
import { ExternalLink, Sep } from "./Primitives";

export function Colophon() {
  return (
    <footer className="relative mt-section border-t-2 border-ink pb-20 pt-8">
      <Ornament slot="footer" />
      <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2">
        <section>
          <h2 className="label">Education</h2>
          <p className="mt-3 text-base font-semibold">{EDUCATION.school}</p>
          <p className="mt-1 text-data text-ink-mid">
            {EDUCATION.degree}
            <Sep />
            <span className="tnum block sm:inline">{EDUCATION.period}</span>
          </p>
          <p className="mt-2 font-mono text-meta text-ink-faint">
            {EDUCATION.activities.join(", ")}
          </p>
        </section>

        <section>
          <h2 className="label">Contact</h2>
          <ul className="mt-3 space-y-2 text-data">
            <li>
              <a href={`mailto:${SITE.email}`} className="doc-link">
                {SITE.email}
              </a>
            </li>
            <li>
              <ExternalLink href={SITE.github}>github.com/eorev</ExternalLink>
            </li>
          </ul>
        </section>
      </div>
    </footer>
  );
}
