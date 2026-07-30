"use client";

import { useCallback } from "react";
import type { BeforeSendFn } from "posthog-js";
import { usePostHog } from "posthog-js/react";

/* ------------------------------------------------------------------ */
/* Event names.                                                        */
/* ------------------------------------------------------------------ */

/**
 * Every custom event the site sends, in one place.
 *
 * PostHog has no schema: a typo becomes a second, permanently separate
 * event rather than an error, and there is no way to merge the two after
 * the fact. Naming them here is what keeps that from happening.
 *
 * snake_case past tense to match PostHog's own `$pageview` / `$autocapture`
 * convention, so the custom events read as siblings of the built-in ones
 * rather than as a second dialect.
 */
export const EVENTS = {
  /** Any click that leaves the page. Bucketed by `destination`. */
  outboundLinkClicked: "outbound_link_clicked",
  /** Split out from the above: the one click that means someone wants to talk. */
  contactEmailClicked: "contact_email_clicked",
  /** Cmd+P on a document styled to print. The resume download, in effect. */
  resumePrinted: "resume_printed",
} as const;

/** Coarse bucket for an outbound click — the useful grouping in a funnel. */
export type LinkDestination =
  | "github"
  | "linkedin"
  | "email"
  | "archive_project";

/**
 * Where on the sheet the link was. GitHub and email each appear twice — once
 * in the top strip, once in the footer — and which one people actually use
 * is the whole reason to record this separately from `destination`.
 */
export type LinkSurface = "masthead" | "footer" | "archive";

/** What made us decide a visitor was worth a person profile. */
export type EngagementSignal = "email" | "print";

/* ------------------------------------------------------------------ */
/* Exception filtering.                                                */
/* ------------------------------------------------------------------ */

/** Where our own JavaScript is served from. Next puts every chunk under it. */
const OWN_BUNDLE_PATH = "/_next/";

/**
 * True when a stack frame points at a file we actually shipped.
 *
 * Same-origin alone is not enough. A script injected into the page by the
 * embedding app runs in the document's context, so its frames carry the
 * *page* URL as their filename — which is same-origin and would pass a
 * naive origin check. Requiring the bundle path is what separates "our code
 * threw" from "something threw while sitting on our page".
 */
function isOwnFrame(frame: unknown): boolean {
  const filename = (frame as { filename?: unknown } | null)?.filename;
  return (
    typeof filename === "string" &&
    /* The trailing slash matters. Matching the bare origin would also match
       any hostname that merely starts with it — whoisethan.dev.example.com
       would read as ours. */
    filename.startsWith(`${window.location.origin}/`) &&
    filename.includes(OWN_BUNDLE_PATH)
  );
}

/**
 * Drop exceptions that did not originate in our own bundle.
 *
 * iOS in-app browsers — Instagram's above all — inject their own scripts into
 * every page they open. Those scripts throw against APIs that only exist
 * inside the host app, and the resulting exception is attributed to whatever
 * site happens to be loaded. The recurring
 * `undefined is not an object (evaluating 'window.webkit.messageHandlers')`
 * is exactly this: not our bug, not fixable by us, and emitted once per
 * Instagram visitor.
 *
 * Left alone it scales with social traffic and buries any real error under
 * noise we can do nothing about, which makes the error tab worthless
 * precisely when it would matter most.
 *
 * Conservative by construction: it only ever inspects `$exception` events —
 * everything else is returned untouched — and it keeps the exception if even
 * one frame comes from our bundle. A stack with no frames at all is dropped,
 * because a genuine error in our own code always carries them; frameless
 * reports are the cross-origin "Script error." case, which tells us nothing.
 */
export const dropForeignExceptions: BeforeSendFn = (event) => {
  if (!event || event.event !== "$exception") return event;

  const exceptions = event.properties?.$exception_list;
  if (!Array.isArray(exceptions)) return event;

  const ours = exceptions.some((exception) => {
    const frames = exception?.stacktrace?.frames;
    return Array.isArray(frames) && frames.some(isOwnFrame);
  });

  return ours ? event : null;
};

/* ------------------------------------------------------------------ */
/* Pseudonymous visitor id.                                            */
/* ------------------------------------------------------------------ */

/**
 * A one-off id for a visitor PostHog has not seen identified before.
 *
 * This is not an identity — nobody signs in here and we never learn a name.
 * It exists so the person who reads the page in the morning, prints it at
 * lunch and comes back a week later is one row instead of three, which is the
 * only person-level question a portfolio actually raises.
 *
 * Deliberately not persisted anywhere by this module. PostHog already stores
 * the identified id durably across localStorage and a cookie, so keeping a
 * second copy would create two sources of truth that drift the moment a
 * browser clears one store and not the other — and identify() silently
 * refuses to switch an already-identified visitor to a different id, so the
 * drift would be permanent and invisible. Ask PostHog instead; see below.
 */
function newVisitorId(): string | null {
  try {
    return `visitor_${crypto.randomUUID()}`;
  } catch {
    /* randomUUID needs a secure context. No id means no profile — the event
       itself still lands anonymously, which is the right trade. Analytics
       must never be the reason a link stops working. */
    return null;
  }
}

/* ------------------------------------------------------------------ */
/* The hook.                                                           */
/* ------------------------------------------------------------------ */

/**
 * Capture and identify, both safe to call when PostHog is not running.
 *
 * `usePostHog()` outside a provider returns the uninitialised global rather
 * than undefined, so an absent NEXT_PUBLIC_POSTHOG_KEY would otherwise reach
 * a client that has never been booted. `__loaded` is the flag posthog-js sets
 * after init; checking it is what makes every call below a no-op locally and
 * on any preview deploy without env vars.
 */
export function useAnalytics() {
  const posthog = usePostHog();

  const track = useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      if (!posthog?.__loaded) return;
      posthog.capture(event, properties);
    },
    [posthog],
  );

  /**
   * Promote an anonymous visitor to a person profile.
   *
   * `person_profiles: "identified_only"` in providers.tsx means drive-by
   * traffic never creates a profile and never costs anything. This is the
   * only thing that opts someone in, and it is deliberately reserved for the
   * two actions that carry real intent: writing to him, and printing the
   * sheet. A visitor who scrolls and leaves stays a free anonymous event.
   */
  const markEngaged = useCallback(
    (via: EngagementSignal) => {
      if (!posthog?.__loaded) return;

      /* Overwritten on each new signal: the most recent thing they did. */
      const set = { last_engaged_via: via };
      /* Set once and never again, so first touch survives later visits. */
      const setOnce = {
        first_engaged_via: via,
        first_engaged_at: new Date().toISOString(),
      };

      /* Already has a profile — from an earlier visit, or from the click that
         preceded this print. identify() with a fresh id would be rejected
         outright here rather than switching them over, so this branch is not
         an optimisation: without it every engagement after the first would
         quietly write nothing. */
      if (posthog._isIdentified()) {
        posthog.setPersonProperties(set, setOnce);
        return;
      }

      const id = newVisitorId();
      if (!id) return;

      posthog.identify(id, set, setOnce);
    },
    [posthog],
  );

  return { track, markEngaged };
}
