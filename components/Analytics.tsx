"use client";

import { useEffect, useRef, useState } from "react";
import { usePostHog } from "posthog-js/react";

import { EVENTS, useAnalytics } from "@/lib/analytics";

/* ------------------------------------------------------------------ */
/* Print.                                                              */
/* ------------------------------------------------------------------ */

/** Window within which two print signals are treated as the same print. */
const PRINT_DEDUPE_MS = 1000;

/**
 * Records a print as the resume download it actually is.
 *
 * There is no PDF on this site to download. What there is instead is a real
 * `@media print` block — the document is built to come out of a printer as a
 * datasheet — so Cmd+P is the moment someone takes a copy away with them.
 * That is the strongest intent signal the page has, and it is invisible to
 * autocapture, which only ever sees DOM events.
 *
 * Two listeners for one action: Safari has never fired `beforeprint`, but it
 * does flip the print media query. The timestamp guard is what stops the
 * browsers that do both from counting a single print twice.
 *
 * Renders nothing. It is mounted inside the PostHog provider in providers.tsx,
 * which means it does not mount at all when there is no key configured.
 */
export function PrintTracker() {
  const { track, markEngaged } = useAnalytics();

  /* Refs, not state: this component has no visual output, so a print must
     never schedule a render. */
  const lastPrintAt = useRef(0);

  useEffect(() => {
    const onPrint = () => {
      const now = Date.now();
      if (now - lastPrintAt.current < PRINT_DEDUPE_MS) return;
      lastPrintAt.current = now;

      track(EVENTS.resumePrinted);
      markEngaged("print");
    };

    window.addEventListener("beforeprint", onPrint);

    const printQuery = window.matchMedia("print");
    const onQueryChange = (event: MediaQueryListEvent) => {
      if (event.matches) onPrint();
    };
    printQuery.addEventListener("change", onQueryChange);

    return () => {
      window.removeEventListener("beforeprint", onPrint);
      printQuery.removeEventListener("change", onQueryChange);
    };
  }, [track, markEngaged]);

  return null;
}

/* ------------------------------------------------------------------ */
/* Self-exclusion.                                                     */
/* ------------------------------------------------------------------ */

const OPT_OUT_PARAM = "ph_optout";

/**
 * Lets the site's owner remove himself from his own numbers.
 *
 * The `internal_or_test_user_hostname` default only flags localhost, so
 * visiting the real domain from his own phone counts exactly like a stranger
 * — and now that engagement is tracked, tapping his own email link registers
 * a conversion and mints a person profile. On a site whose whole audience is
 * a few dozen people, testing a link measurably moves the numbers.
 *
 * `?ph_optout=1` opts this browser out for good; PostHog persists that
 * decision and refuses to capture on later visits without any help from us.
 * `?ph_optout=0` undoes it, so this is not a one-way door if he opts out on
 * the wrong device.
 *
 * One caveat worth knowing: PostHog boots and sends its pageview before React
 * effects run, so the visit that *carries* the flag still records that single
 * pageview. Every visit after it is silent.
 */
export function OptOutFlag() {
  const posthog = usePostHog();
  const [state, setState] = useState<"idle" | "out" | "in">("idle");

  useEffect(() => {
    if (!posthog?.__loaded) return;

    const requested = new URLSearchParams(window.location.search).get(
      OPT_OUT_PARAM,
    );
    if (requested === null) return;

    if (requested === "0") {
      posthog.opt_in_capturing();
      setState("in");
      return;
    }

    posthog.opt_out_capturing();
    setState("out");
  }, [posthog]);

  /* Nothing renders for an ordinary visitor: the notice only ever appears for
     someone who typed the flag deliberately. Without it there is no way to
     tell the opt-out worked, since a silent success and a broken flag look
     identical from the outside. */
  if (state === "idle") return null;

  return (
    <div
      role="status"
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-rule-strong bg-paper px-gutter py-3"
    >
      <p className="label mx-auto max-w-doc text-ink">
        <span className="text-signal">●</span>{" "}
        {state === "out"
          ? "Analytics off for this browser. Visit ?ph_optout=0 to undo."
          : "Analytics back on for this browser."}
      </p>
    </div>
  );
}
