"use client";

import { useEffect, useRef, useState } from "react";
import {
  LayoutChapters,
  LayoutGallery,
  LayoutIndex,
  LayoutSpread,
  LayoutStage,
} from "./variants";

const LAYOUTS = [
  {
    id: "stage",
    name: "Stage",
    note: "A full-height cover holding only the name, then the document begins.",
    View: LayoutStage,
  },
  {
    id: "spread",
    name: "Spread",
    note: "Asymmetric editorial grid. Photographs break the margins entirely.",
    View: LayoutSpread,
  },
  {
    id: "index",
    name: "Index",
    note: "Everything as scannable rows. Almost no prose, maximum density.",
    View: LayoutIndex,
  },
  {
    id: "gallery",
    name: "Gallery",
    note: "Image-led. Full-bleed photographs set the pace between sections.",
    View: LayoutGallery,
  },
  {
    id: "chapters",
    name: "Chapters",
    note: "Each section takes its own screen, opened by an oversized number.",
    View: LayoutChapters,
  },
] as const;

export function LayoutSwitcher() {
  const [i, setI] = useState(0);
  const tabsRef = useRef<HTMLDivElement>(null);
  const { View, note } = LAYOUTS[i];

  function go(next: number) {
    const w = (next + LAYOUTS.length) % LAYOUTS.length;
    setI(w);
    const btns = tabsRef.current?.querySelectorAll("button");
    (btns?.[w] as HTMLButtonElement | undefined)?.focus();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= LAYOUTS.length) return setI(n - 1);
      if (e.key === "ArrowRight") go(i + 1);
      if (e.key === "ArrowLeft") go(i - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <>
      <div aria-hidden="true" className="h-[3px] w-full bg-signal" />
      <div className="pb-28">
        <View />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-3 pb-3">
        <div className="flex max-w-full flex-col items-center gap-1.5 rounded-2xl bg-[oklch(0.2_0.012_265)] px-2.5 py-2 text-[oklch(0.97_0_0)] shadow-[0_18px_50px_-18px_oklch(0_0_0/0.6)] ring-1 ring-white/12">
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Layout studies"
            className="flex flex-wrap justify-center gap-1"
          >
            {LAYOUTS.map((l, n) => {
              const on = n === i;
              return (
                <button
                  key={l.id}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  tabIndex={on ? 0 : -1}
                  onClick={() => setI(n)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowRight") {
                      e.preventDefault();
                      go(n + 1);
                    }
                    if (e.key === "ArrowLeft") {
                      e.preventDefault();
                      go(n - 1);
                    }
                  }}
                  className={`rounded-xl px-3 py-1.5 text-sm transition-colors duration-150 ${
                    on
                      ? "bg-white text-black"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="mr-1.5 tabular-nums opacity-50">{n + 1}</span>
                  {l.name}
                </button>
              );
            })}
          </div>
          <p className="px-1 text-center text-[0.72rem] text-white/50">
            {note}
            <span className="mx-2 text-white/25">·</span>
            <a href="/" className="underline underline-offset-2 hover:text-white">
              live site
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
