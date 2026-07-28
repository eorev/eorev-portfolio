import Image from "next/image";
import type { Plate } from "@/lib/content";

/**
 * Two rows of photographs drifting in opposite directions.
 *
 * Each row's track holds its photographs twice over, so animating exactly one
 * half lands on the duplicate and the loop is seamless. That means no JS, no
 * scroll listener and no measurement: the whole thing is one CSS keyframe the
 * compositor handles. Hovering or tabbing into a row pauses it.
 *
 * The duplicate set is hidden from assistive tech, so a screen reader hears
 * each photograph once rather than twice.
 */

function Row({
  plates,
  reverse = false,
  duration,
}: {
  plates: Plate[];
  reverse?: boolean;
  duration: string;
}) {
  const Track = ({ hidden }: { hidden?: boolean }) => (
    <ul
      className="flex shrink-0 gap-2"
      aria-hidden={hidden || undefined}
      role={hidden ? "presentation" : undefined}
    >
      {plates.map((p) => (
        <li key={p.src} className="group relative shrink-0">
          <Image
            src={p.src}
            alt={hidden ? "" : p.alt}
            width={p.w}
            height={p.h}
            sizes="(max-width: 767px) 45vw, 22vw"
            className="h-[clamp(9rem,17vw,15rem)] w-auto max-w-none bg-paper-sunk object-cover"
            loading="lazy"
          />
          {/* Caption only on hover: a moving strip is no place for standing text. */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-1 bg-gradient-to-t from-ink/75 to-transparent px-2 pb-1.5 pt-6 font-mono text-meta text-paper opacity-0 transition-all duration-200 ease-out-quart group-hover:translate-y-0 group-hover:opacity-100">
            {p.caption}
          </span>
        </li>
      ))}
    </ul>
  );

  // The animation shifts the track by half its width, so half the track must
  // be at least as wide as the viewport or a gap opens mid-loop. Four sets
  // means half the track is two sets, which covers viewports far wider than
  // any single set of photographs.
  return (
    <div className="marquee-window overflow-hidden">
      <div
        className={`marquee ${reverse ? "marquee--reverse" : ""}`}
        style={{ ["--dur" as string]: duration }}
      >
        <Track />
        <Track hidden />
        <Track hidden />
        <Track hidden />
      </div>
    </div>
  );
}

export function PhotoMarquee({ plates }: { plates: Plate[] }) {
  if (plates.length < 2) return null;
  // interleave so neither row is all portrait or all landscape
  const top = plates.filter((_, i) => i % 2 === 0);
  const bottom = plates.filter((_, i) => i % 2 === 1);

  return (
    <div className="bleed mt-8 space-y-2">
      <Row plates={top} duration="78s" />
      <Row plates={bottom} duration="64s" reverse />
    </div>
  );
}
