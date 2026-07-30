"use client";

import type { ReactNode } from "react";
import { PostHogProvider } from "posthog-js/react";

import { PrintTracker } from "@/components/TrackedLink";

// Inlined at build time by Next. Absent locally until .env.local is filled in,
// and absent on any preview/branch deploy that has no env vars set — in that
// case we render children untouched rather than booting a broken client.
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;

// Where the PostHog *UI* lives (app.posthog.com vs eu.posthog.com). Only used
// to build "view in PostHog" links from the toolbar — ingestion goes through
// the /ingest rewrite in next.config.mjs, never straight to this host.
const POSTHOG_UI_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_UI_HOST ?? "https://us.posthog.com";

export function PostHogAnalytics({ children }: { children: ReactNode }) {
  if (!POSTHOG_KEY) return <>{children}</>;

  return (
    <PostHogProvider
      apiKey={POSTHOG_KEY}
      options={{
        // Same-origin proxy — see the rewrites in next.config.mjs. Sending to
        // /ingest instead of *.i.posthog.com is what keeps ad blockers from
        // eating a chunk of the traffic.
        api_host: "/ingest",
        ui_host: POSTHOG_UI_HOST,

        // Behaviour preset. Pinning the date means upgrading posthog-js can't
        // silently change what gets captured. This one turns on:
        //   capture_pageview: 'history_change'  -> App Router route changes
        //   internal_or_test_user_hostname      -> flags localhost traffic
        //   rageclick / dead clicks             -> frustration signals
        defaults: "2026-06-25",

        // Anonymous visitors don't get a person profile, so a portfolio's worth
        // of drive-by traffic doesn't burn through the person-profile quota.
        // useAnalytics().markEngaged in lib/analytics.ts is the only thing that
        // opts anyone in, and only for an email click or a print.
        person_profiles: "identified_only",
      }}
    >
      {children}
      <PrintTracker />
    </PostHogProvider>
  );
}
