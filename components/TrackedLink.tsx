"use client";

import { useEffect, useRef, type ReactNode } from "react";

import {
  EVENTS,
  useAnalytics,
  type LinkDestination,
  type LinkSurface,
} from "@/lib/analytics";

/**
 * An outbound anchor that records itself.
 *
 * Autocapture already sees these clicks, but it sees them as `$autocapture`
 * on an `<a>` with some text — indistinguishable from every other click on
 * the page, and unusable as a funnel step. This names them.
 *
 * Everything that renders it — TopStrip, Contact, ArchiveRows — stays a
 * server component, because the client boundary is drawn at the leaf rather
 * than at the section.
 *
 * The handler never calls preventDefault and never awaits anything, so a
 * failed capture cannot stop the navigation. Every link here is either
 * `mailto:` or `target="_blank"`, which means the page survives the click and
 * the request has time to leave — no sendBeacon juggling required.
 */
export function TrackedLink({
  href,
  destination,
  surface,
  label,
  className = "",
  children,
}: {
  href: string;
  destination: LinkDestination;
  surface: LinkSurface;
  /** Human name for the target — the link text, or the project's name. */
  label: string;
  className?: string;
  children: ReactNode;
}) {
  const { track, markEngaged } = useAnalytics();

  /* mailto: hands off to a mail client. Opening that in a new tab leaves an
     empty one behind in most browsers, so the target is conditional — the
     same rule the raw markup used before this component existed. */
  const isMailto = href.startsWith("mailto:");

  const onClick = () => {
    if (isMailto) {
      track(EVENTS.contactEmailClicked, { surface });
      markEngaged("email");
      return;
    }

    track(EVENTS.outboundLinkClicked, { destination, surface, label, href });
  };

  return (
    <a
      href={href}
      target={isMailto ? undefined : "_blank"}
      rel="noopener noreferrer"
      className={className}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

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
