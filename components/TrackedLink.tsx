"use client";

import type { ReactNode } from "react";

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
