import { LIFE_LEAD } from "@/lib/content";
import { Ornament } from "./Ornament";
import { PlateStrip } from "./PlateStrip";

export function Life() {
  return (
    <div className="relative">
      <Ornament slot="life" />
      <p className="mt-7 max-w-prose text-body text-ink-mid">{LIFE_LEAD}</p>
      <PlateStrip />
    </div>
  );
}
