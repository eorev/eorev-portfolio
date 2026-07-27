import type { Metadata } from "next";
import { LayoutGallery } from "@/components/layouts/variants";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Gallery is the site.
 *
 * It still lives under `components/layouts` because that is where it was
 * designed and where the other four studies remain for comparison. The
 * follow-up in HANDOFF.md — lifting Gallery out of that directory and
 * retiring the studies — is a deliberate cleanup, not something to do by
 * accident: `/` now depends on that module.
 */
export default function Page() {
  return (
    <>
      {/* Head margin rule: the sheet's top edge. Belongs to this page, not to
          every route under the root layout. LayoutSwitcher draws this on
          /layouts, so rendering Gallery on its own has to supply it. */}
      <div aria-hidden="true" className="no-print h-[3px] w-full bg-signal" />
      <LayoutGallery />
    </>
  );
}
