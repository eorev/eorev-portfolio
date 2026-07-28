# PRODUCT.md

## Register

brand

The site is a personal portfolio. The design is the product: a visitor's
impression is the entire deliverable.

## Product Purpose

A single-document portfolio for Ethan Orevillo, a backend and infrastructure
engineer. It exists to answer one question fast: what does he actually own and
run in production?

The previous version (2024) sold him as a student who ships side projects. That
framing is now two years out of date and actively undersells him. This version
sells him as an engineer who owns a production system: a Go API, its data layer,
and the infrastructure under it.

## Users

Three readers, in priority order.

1. **Engineering hiring managers and senior engineers.** Skimming for depth and
   evidence of ownership. They want scope, stack, and whether he ran the thing
   or just contributed to it. They will not read paragraphs.
2. **Recruiters.** Scanning for keywords, titles, dates, and current employer.
   They need the facts legible in under ten seconds.
3. **Peers and collaborators.** Arriving from GitHub or a Discord link, curious
   what he works on.

All three arrive from a link (LinkedIn, GitHub, a message). Nobody lands here
by search. The job is conversion of an existing click, not discovery.

## Brand Voice

Three words: **exact, unshowy, load-bearing.**

The voice of a well-set technical document. Every claim is specific and
checkable. No adjectives doing work that a number or a stack name could do.
No enthusiasm as a substitute for substance.

Things it says: "I own the Go API, the data layer, and the infrastructure."
Things it does not say: "passionate about building beautiful experiences."

## Strategic Principles

- **Ownership over participation.** Every entry states what he owns, not what
  he was "involved in." Where he only contributed, say so.
- **Specific over impressive.** "Postgres and pgvector" beats "modern data
  stack." Named technologies, real dates, honest status labels.
- **Rounded, never precise, on business metrics.** BurntBase is co-owned and
  its usage numbers are not his alone to publish. Orders of magnitude only:
  "tens of thousands of users," "hundreds of thousands of indexed layouts."
  Never exact counts, never revenue, never payer counts.
- **Density is the feature.** The reader is skimming. A dense, scannable
  document respects that; a spacious one with six words per screen does not.
- **No dead facts.** No hardcoded ages, no "incoming" job titles, no "coming
  soon" projects. The 2024 version broke on all three.

## Anti-References

- **The 2024 version of this site.** Sidebar nav, `useState` view switching,
  identical project cards, a decorative Three.js brain, and a bio that still
  says "21 y/o" and lists Prudential as "Incoming Intern."
- **The dark terminal portfolio.** Monospace on near-black with a green accent
  and a fake shell prompt. This is the single most common developer-portfolio
  look and it makes every engineer who uses it interchangeable.
- **The editorial-typographic lane.** Oversized display serif, italic pull
  quotes, ruled three-column metadata, monochrome restraint. Saturated, and
  wrong for someone whose work is systems rather than writing.
- **Agency-style scroll theatre.** Full-viewport sections, scroll-jacking,
  parallax, one sentence per fold. It buries the facts a recruiter needs.
- **Gradient-and-glass SaaS.** Glassmorphic cards, gradient headings, hero
  metric templates.

## Content Rules

- Business metrics are rounded to orders of magnitude. See Strategic Principles.
- Excluded by explicit instruction: Project Freefall, Kodai.
- Included by explicit instruction: Click Automation, and the anti-bot reverse
  engineering work, framed as security research.
- The anti-bot section names the systems studied (Footlocker, Champs) and leads
  with technical substance: fingerprinting, obfuscated JS, sensor generation.
  It reads as applied security engineering, adjacent to his CTF and security
  audit background, because that is what it is.
- Contact email and Discord handle stay on the page; they were already public.
