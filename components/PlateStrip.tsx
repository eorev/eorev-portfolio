import Image from "next/image";
import { PLATES } from "@/lib/content";
import { Annotation } from "./Annotation";

/**
 * Two layouts from one markup.
 *
 * On narrow screens the plates run as a full-bleed strip you swipe through,
 * which is what a thumb wants. On desktop that same strip becomes a
 * multi-column photo wall inside the document margins: a horizontal scroller
 * on a wide display wastes the width, hides most of the set, and asks a
 * mouse to do something it is bad at. The wall keeps every photo at its
 * natural aspect, so nothing is cropped to fit a grid.
 */
export function PlateStrip() {
  if (PLATES.length === 0) return null;

  return (
    <div className="bleed mt-9 md:mx-0">
      <ol
        className="flex snap-x scroll-px-gutter gap-1 overflow-x-auto px-gutter pb-2
                   md:block md:columns-2 md:gap-1 md:overflow-visible md:px-0 md:pb-0
                   lg:columns-3"
      >
        {PLATES.map((plate, i) => (
          <li
            key={plate.src}
            className="shrink-0 snap-start md:mb-6 md:break-inside-avoid"
          >
            <figure>
              <div className="relative">
                <Image
                  src={plate.src}
                  alt={plate.alt}
                  width={plate.w}
                  height={plate.h}
                  sizes="(max-width: 767px) 70vw, (max-width: 1023px) 46vw, 33vw"
                  className="h-[clamp(15rem,44vw,21rem)] w-auto max-w-none bg-paper-sunk object-cover
                             md:h-auto md:w-full"
                  loading={i < 3 ? "eager" : "lazy"}
                />
                {plate.annotation && (
                  <Annotation
                    annotation={plate.annotation}
                    w={plate.w}
                    h={plate.h}
                  />
                )}
              </div>
              <figcaption className="mt-2.5 max-w-[18rem]">
                <span className="label tnum text-signal">
                  Plate {String(i + 1).padStart(2, "0")}
                </span>
                <span className="mt-1 block font-mono text-meta text-ink-mid">
                  {plate.caption}
                </span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ol>
    </div>
  );
}
