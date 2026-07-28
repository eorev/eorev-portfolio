import type { Plate } from "@/lib/content";

type Ann = NonNullable<Plate["annotation"]>;

/**
 * Builds a hand-drawn-feeling squiggle between two points by walking the
 * straight line between them and alternating a perpendicular offset, so the
 * wave reads relative to the direction of travel rather than the axes. The
 * amplitude decays toward the target so the line lands cleanly on the
 * subject instead of wobbling past it.
 */
function squiggle(
  [fx, fy]: [number, number],
  [tx, ty]: [number, number],
  amp: number,
  waves = 3,
) {
  const dx = tx - fx;
  const dy = ty - fy;
  const len = Math.hypot(dx, dy) || 1;
  const px = -dy / len;
  const py = dx / len;

  let d = `M ${fx.toFixed(1)} ${fy.toFixed(1)}`;
  const segments = waves * 2;
  for (let i = 1; i <= segments; i++) {
    const mid = (i - 0.5) / segments;
    const end = i / segments;
    const side = i % 2 ? 1 : -1;
    const decay = 1 - end * 0.7;
    const cx = fx + dx * mid + px * amp * side * decay;
    const cy = fy + dy * mid + py * amp * side * decay;
    d += ` Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${(fx + dx * end).toFixed(1)} ${(
      fy +
      dy * end
    ).toFixed(1)}`;
  }
  return d;
}

/**
 * Overlays a plate at its intrinsic pixel dimensions. Because the image
 * renders at its natural aspect ratio, the default preserveAspectRatio maps
 * this 1:1 with no distortion, which lets the label be real SVG text.
 */
export function Annotation({
  annotation,
  w,
  h,
}: {
  annotation: Ann;
  w: number;
  h: number;
}) {
  const { label, from, to } = annotation;

  const target: [number, number] = [to[0] * w, to[1] * h];
  const anchor: [number, number] = [from[0] * w, from[1] * h];
  // Start the line below and right of the label, clear of the glyphs.
  const start: [number, number] = [anchor[0] + w * 0.16, anchor[1] + h * 0.035];

  const fontSize = Math.round(w * 0.034);

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <path
        d={squiggle(start, target, Math.min(w, h) * 0.036)}
        fill="none"
        stroke="var(--signal)"
        strokeWidth="1.5"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle
        cx={target[0]}
        cy={target[1]}
        r={w * 0.014}
        fill="var(--signal)"
      />
      <text
        x={anchor[0]}
        y={anchor[1]}
        fill="var(--signal)"
        fontSize={fontSize}
        fontFamily="var(--font-spline-mono), monospace"
        letterSpacing={fontSize * 0.08}
        style={{ textTransform: "uppercase" }}
      >
        {label}
      </text>
    </svg>
  );
}
