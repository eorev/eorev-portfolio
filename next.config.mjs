/** @type {import('next').NextConfig} */

// US cloud by default; set NEXT_PUBLIC_POSTHOG_REGION=eu to switch both hosts.
const REGION = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";
const POSTHOG_ASSET_HOST = `https://${REGION}-assets.i.posthog.com`;
const POSTHOG_INGEST_HOST = `https://${REGION}.i.posthog.com`;

/* Short links for places that only allow one URL — a profile bio, a story
   sticker. They exist so the address that gets published stays readable while
   still carrying the tags underneath.

   utm_medium is the field that matters: PostHog derives $channel_type from it,
   and "social" is what puts a visit in Organic Social instead of Direct. This
   is not decoration — Instagram's in-app browser strips the referrer header,
   so for those clicks the tag is the *only* surviving evidence of where the
   visitor came from. An untagged Instagram click is indistinguishable from
   someone typing the domain.

   utm_content separates the placements, so a bio click and a story click do
   not arrive as one undifferentiated blob. */
const CAMPAIGN_LINKS = [
  ["/ig", "instagram", "social", "bio"],
  ["/ig-story", "instagram", "social", "story"],
  ["/li", "linkedin", "social", "profile"],
];

const nextConfig = {
  /* Deliberately temporary (307), never permanent. A 308 is cached by the
     browser indefinitely, so every past visitor would keep resolving the old
     destination and these links could never be repointed. */
  async redirects() {
    return CAMPAIGN_LINKS.map(([source, utmSource, utmMedium, utmContent]) => ({
      source,
      destination: `/?utm_source=${utmSource}&utm_medium=${utmMedium}&utm_content=${utmContent}`,
      permanent: false,
    }));
  },

  // Proxy PostHog through our own origin. Requests go to /ingest/* instead of
  // *.i.posthog.com, which ad blockers block on sight — without this a real
  // slice of visits never gets recorded.
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: `${POSTHOG_ASSET_HOST}/static/:path*`,
      },
      {
        source: "/ingest/:path*",
        destination: `${POSTHOG_INGEST_HOST}/:path*`,
      },
    ];
  },

  // PostHog's API expects trailing slashes; without this Next redirects them
  // away and the proxied requests 404.
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
