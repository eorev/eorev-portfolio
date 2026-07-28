/** @type {import('next').NextConfig} */

// US cloud by default; set NEXT_PUBLIC_POSTHOG_REGION=eu to switch both hosts.
const REGION = process.env.NEXT_PUBLIC_POSTHOG_REGION === "eu" ? "eu" : "us";
const POSTHOG_ASSET_HOST = `https://${REGION}-assets.i.posthog.com`;
const POSTHOG_INGEST_HOST = `https://${REGION}.i.posthog.com`;

const nextConfig = {
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
