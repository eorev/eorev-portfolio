import type { CSSProperties } from "react";
import Image from "next/image";
import type { Plate } from "@/lib/content";

/**
 * A justified gallery: rows of equal height whose widths are proportional to
 * each photograph's own shape, so every row fills the measure exactly and
 * nothing is cropped to fit a cell.
 *
 * The row packing is decided here from the known dimensions, then the
 * justification itself is left to flexbox: `flex-grow` set to a photo's
 * aspect ratio with a zero basis makes widths land in proportion to aspect,
 * which means every image in a row resolves to the same height. No script,
 * no measurement, and it re-justifies at any container width.
 */

/** Greedy packing: close a row once it is nearer the target than it would be
 *  with one more photo. Keeps rows visually even without a solver. */
function pack(plates: Plate[], target: number): Plate[][] {
  const rows: Plate[][] = [];
  let row: Plate[] = [];
  let sum = 0;

  for (const p of plates) {
    const aspect = p.w / p.h;
    if (
      row.length &&
      Math.abs(sum - target) < Math.abs(sum + aspect - target)
    ) {
      rows.push(row);
      row = [];
      sum = 0;
    }
    row.push(p);
    sum += aspect;
  }
  if (row.length) rows.push(row);

  // A lone photograph stranded on the final row reads as a mistake. Fold it
  // into the row above where that row can absorb it without going slack.
  if (rows.length > 1 && rows[rows.length - 1].length === 1) {
    const last = rows[rows.length - 1];
    const prev = rows[rows.length - 2];
    const merged = [...prev, ...last].reduce((a, p) => a + p.w / p.h, 0);
    if (merged < target * 1.6) {
      prev.push(...last);
      rows.pop();
    }
  }
  return rows;
}

const TARGET = 3.2;

export function PhotoGrid({ plates }: { plates: Plate[] }) {
  if (!plates.length) return null;
  // ~3.2 units of aspect per row reads as roughly three landscape frames, or
  // four portraits, at the document width.
  const rows = pack(plates, TARGET);
  let n = 0;

  return (
    // Below lg the packed rows are deliberately dissolved: each row wrapper
    // becomes `display: contents`, so every figure reflows as a direct child
    // of one continuous flow. Without this the pre-packed rows wrap on their
    // own and strand a half-width photograph at the end of most of them.
    //
    // That flow is multi-column rather than flex on purpose. Flex rows take
    // the height of their tallest member, so a short plate beside a tall one
    // leaves a band of dead paper underneath it; columns pack to whatever
    // height each photograph actually has, still without cropping anything.
    <div className="mt-8 columns-1 gap-2 sm:columns-2 lg:[columns:auto] lg:space-y-2">
      {rows.map((row, ri) => {
        // A final row well short of the target would stretch its photographs
        // to absurd height to fill the measure. Leave those at the ordinary
        // row height and let the row end early instead.
        const sum = row.reduce((a, p) => a + p.w / p.h, 0);
        const loose = sum < TARGET * 0.72;
        return (
          <div key={ri} className="contents lg:flex lg:flex-wrap lg:gap-2">
            {row.map((p) => {
              n += 1;
              const aspect = p.w / p.h;
              return (
                <figure
                  key={p.src}
                  // One column on a phone, two from sm, each plate kept whole
                  // across the column break. The justified behaviour only
                  // switches on at lg, where there is width for it. Both
                  // arbitrary-property strings are written out in full so
                  // Tailwind's scanner can see them.
                  className={`group relative mb-2 break-inside-avoid lg:mb-0 lg:min-w-[11rem] ${
                    loose
                      ? "lg:[flex-basis:var(--loose)] lg:[flex-grow:0]"
                      : "lg:[flex-basis:0] lg:[flex-grow:var(--aspect)]"
                  }`}
                  style={
                    {
                      "--aspect": aspect,
                      "--loose": `${aspect * 22}rem`,
                    } as CSSProperties
                  }
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={p.w}
                    height={p.h}
                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="h-auto w-full bg-paper-sunk object-cover"
                    loading={ri === 0 ? "eager" : "lazy"}
                  />
                  {/* Touch devices have no hover, so below lg the caption is
                      set beneath the plate as ordinary type rather than a
                      gradient overlay that could never be revealed. */}
                  <figcaption className="mt-1.5 flex items-baseline gap-2 lg:pointer-events-none lg:absolute lg:inset-x-0 lg:bottom-0 lg:mt-0 lg:bg-gradient-to-t lg:from-ink/75 lg:to-transparent lg:px-2.5 lg:pb-2 lg:pt-8 lg:opacity-0 lg:transition-opacity lg:duration-200 lg:ease-out-quart lg:group-hover:opacity-100">
                    <span className="label tnum text-ink-faint lg:text-paper/70">
                      {String(n).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-meta text-ink-mid lg:text-paper">
                      {p.caption}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
