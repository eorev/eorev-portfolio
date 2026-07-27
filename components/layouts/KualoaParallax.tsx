"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * A window onto the Kualoa photograph with the two figures held still while
 * the landscape drifts behind them.
 *
 * Two layers share one image space: a plate with the figures painted out, and
 * a transparent cutout of the figures. Moving the plate further than the
 * cutout separates them in depth.
 *
 * Four inputs drive it, all summed in a single rAF loop that writes CSS
 * custom properties — the browser only composites, never re-lays-out:
 *
 *   --e   entrance, 0..1, eased once on mount
 *   --ax  ambient drift, a slow sine so the depth is visible without the
 *         visitor having to find it
 *   --sx/--sy  pointer, which fades the ambient out as the visitor takes over
 *   --p   scroll position through the viewport
 *   --pan common drift, touch only — see below
 *
 * The combined plate-vs-cutout separation is deliberately budgeted: the plate
 * is reconstructed 44px past the silhouettes (~28 display px), and the inputs
 * together stay inside that, or the reconstruction edge would show.
 *
 * Touch behaves differently. There is no pointer to hand control to, and
 * `pointermove` on a phone only fires once a finger is already dragging the
 * page, so the effect was effectively invisible there. On touch the pointer
 * is not wired up at all and the frame drifts on its own instead.
 *
 * Making that drift visible without blowing the margin relies on one fact:
 * only the DIFFERENCE between the two layers can expose the reconstruction
 * edge. Motion applied equally to both costs nothing. So `--pan` moves the
 * whole scene — plate and figures together, identical multiplier, zero
 * differential — and `--ax` keeps supplying the depth at a modest boost that
 * still sits inside the margin:
 *
 *   margin      44 / 2731  = 1.61% of image width
 *   differential 1.05 - 0.09 = 0.96%, x1.3 boost = 1.25%   (78% of budget)
 *
 * The visible travel is the sum of the two, so it reads as real movement
 * while the part that could tear stays well inside its allowance.
 */

const ENTER_MS = 1500;

/** Touch: ~10s for a full there-and-back, which reads as drift, not scrolling. */
const TOUCH_DRIFT_MS = 1600;
/** Kept under the 1.68x headroom the reconstruction margin allows. */
const TOUCH_DRIFT_GAIN = 1.3;

export function KualoaParallax({
  className = "",
  caption,
}: {
  className?: string;
  caption?: string;
}) {
  const frame = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = frame.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--e", "1");
      return;
    }

    // No hover means no pointer worth listening to. Checked once: a device
    // does not grow a mouse mid-session, and re-running this on resize would
    // restart the entrance.
    const touch = window.matchMedia("(hover: none)").matches;

    let raf = 0;
    let running = true;
    const start = performance.now();

    const onPointer = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      target.current.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.current.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    const tick = (now: number) => {
      if (!running) return;
      const t = now - start;

      // entrance: ease-out-quint, runs once
      const e = Math.min(1, t / ENTER_MS);
      const entered = 1 - Math.pow(1 - e, 5);

      // pointer easing
      pointer.current.x += (target.current.x - pointer.current.x) * 0.06;
      pointer.current.y += (target.current.y - pointer.current.y) * 0.06;

      // ambient drift, silenced as the pointer takes over. On touch nothing
      // ever takes over, so grip stays 0 and the drift simply continues.
      const grip = touch
        ? 0
        : Math.min(1, Math.hypot(pointer.current.x, pointer.current.y) * 1.4);
      const gain = touch ? TOUCH_DRIFT_GAIN : 1;
      const period = touch ? TOUCH_DRIFT_MS : 3000;
      const ambient =
        (Math.sin(t / period) * 0.85 + Math.sin(t / 7100) * 0.15) *
        entered *
        (1 - grip) *
        gain;

      // Common drift: both layers, same multiplier, so it adds visible travel
      // without adding any plate-vs-cutout separation. Touch only — on desktop
      // the pointer already supplies the motion.
      const pan = touch ? Math.sin(t / TOUCH_DRIFT_MS) * entered : 0;

      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const progress = Math.max(
        -1,
        Math.min(1, (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2)),
      );

      el.style.setProperty("--e", entered.toFixed(4));
      el.style.setProperty("--ax", ambient.toFixed(4));
      el.style.setProperty("--sx", pointer.current.x.toFixed(4));
      el.style.setProperty("--sy", pointer.current.y.toFixed(4));
      el.style.setProperty("--p", progress.toFixed(4));
      el.style.setProperty("--pan", pan.toFixed(4));

      raf = requestAnimationFrame(tick);
    };

    if (!touch) {
      el.addEventListener("pointermove", onPointer);
      el.addEventListener("pointerleave", onLeave);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onPointer);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <figure className={className}>
      {/* Edge to edge on a phone, where the width is the whole point. On
          desktop it sits in the document column so it lines up with the
          type instead of overpowering it. */}
      <div className="md:mx-auto md:max-w-doc md:px-gutter">
        <div
          ref={frame}
          className="relative h-[clamp(18rem,58vh,36rem)] w-full overflow-hidden bg-paper-sunk"
          style={
            {
              "--e": 0,
              "--ax": 0,
              "--sx": 0,
              "--sy": 0,
              "--p": 0,
              "--pan": 0,
              opacity: "calc(0.25 + var(--e) * 0.75)",
            } as React.CSSProperties
          }
        >
          {/* Landscape: travels furthest, and arrives from the right. */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              // --pan uses the SAME -1.55% here as on the cutout below. That
              // is what makes it free: identical on both layers means it adds
              // no separation, so it cannot expose the reconstruction edge.
              // Change one, change the other.
              transform: `scale(calc(1.17 + (1 - var(--e)) * 0.05))
              translate3d(
                calc(var(--ax) * -1.05% + var(--pan) * -1.55% + var(--sx) * -0.55% + (1 - var(--e)) * 5%),
                calc(var(--p) * -1.85% + var(--sy) * -0.4%),
                0)`,
            }}
          >
            <Image
              src="/life/parallax/kualoa-plate.webp"
              alt=""
              aria-hidden="true"
              fill
              priority
              sizes="(max-width: 767px) 100vw, 72rem"
              className="object-cover"
            />
          </div>

          {/* The two of you: nearly still, arriving from the other side so the
            two planes visibly converge as the frame settles. */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              // -1.55% matches the plate exactly — see the note above.
              transform: `scale(calc(1.17 + (1 - var(--e)) * 0.01))
              translate3d(
                calc(var(--ax) * -0.09% + var(--pan) * -1.55% + var(--sx) * -0.07% + (1 - var(--e)) * -2.2%),
                calc(var(--p) * -0.22% + var(--sy) * -0.05%),
                0)`,
            }}
          >
            <Image
              src="/life/parallax/kualoa-subject.webp"
              alt="Two people looking up at the ridged green cliffs at Kualoa on Oʻahu. The person on the right is a BurntBase co-owner."
              fill
              priority
              sizes="(max-width: 767px) 100vw, 72rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {caption && (
        <figcaption className="mx-auto mt-2.5 max-w-doc px-gutter">
          <span className="label tnum text-signal">Plate 01</span>
          <span className="ml-3 font-mono text-meta text-ink-mid">
            {caption}
          </span>
        </figcaption>
      )}
    </figure>
  );
}
