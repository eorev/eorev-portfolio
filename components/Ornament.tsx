import Image from "next/image";
import { ORNAMENTS, type OrnamentSlot } from "@/lib/content";

/**
 * A decorative render dropped into a named slot. Purely visual, so it is
 * hidden from assistive tech and from print. Renders nothing until an asset
 * exists for the slot, which keeps the page honest while art is in progress.
 */

const PLACEMENT: Record<OrnamentSlot, string> = {
  masthead:
    "pointer-events-none absolute -top-4 right-0 w-[clamp(8rem,22vw,15rem)] sm:top-0",
  life: "pointer-events-none absolute -top-10 right-0 w-[clamp(5rem,12vw,8rem)]",
  footer:
    "pointer-events-none absolute -top-16 right-0 w-[clamp(6rem,14vw,9rem)]",
};

export function Ornament({ slot }: { slot: OrnamentSlot }) {
  const art = ORNAMENTS.find((o) => o.slot === slot);
  if (!art) return null;

  return (
    <Image
      src={art.src}
      alt=""
      aria-hidden="true"
      width={art.w}
      height={art.h}
      priority={slot === "masthead"}
      className={`no-print h-auto select-none ${PLACEMENT[slot]}`}
    />
  );
}
