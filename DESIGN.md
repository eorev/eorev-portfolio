# DESIGN.md

## Concept

A technical datasheet. The physical reference is a calibration certificate or a
component spec sheet: printed on warm stock, set in a workhorse grotesque, ruled
with hairlines, organised into labelled fields and numbered rows. Information
density is the aesthetic.

This is a literal document type, which is what earns the mono labels and the
tabular layout. They are the form, not costume.

## Theme

**Light.** The scene: a hiring manager opening the link on a laptop mid-
afternoon, skimming for what this person actually owns before a call. It should
feel like being handed a well-set one-page datasheet, not like entering an app.

Dark was rejected deliberately. It is the reflex answer for developer
portfolios, and it would make the site interchangeable with several thousand
others.

## Color

Strategy: **Restrained**, tinted paper and ink with one committed accent.

Reference point: a printed spec sheet with a single spot colour, the way a
registration mark or a revision stamp sits on an otherwise monochrome page.

```
--paper        oklch(0.972 0.006 85)    warm off-white ground
--paper-sunk   oklch(0.945 0.008 85)    recessed rows, table stripes
--rule         oklch(0.86 0.008 85)     hairline rules
--rule-strong  oklch(0.72 0.01 85)      section dividers
--ink          oklch(0.24 0.012 265)    body text
--ink-mid      oklch(0.46 0.012 265)    secondary text, descriptions
--ink-faint    oklch(0.60 0.010 265)    labels, metadata, units
--signal       oklch(0.575 0.185 34)    accent: vermilion
--signal-sunk  oklch(0.575 0.185 34 / 0.10)  accent wash
```

No `#000`, no `#fff`. Every neutral is tinted: the paper warm toward yellow,
the ink cool toward blue, so the page reads as printed stock rather than screen
grey.

The accent carries: section numbers, rules above section headings, live-status
markers, link underlines, and the header band. It stays under 10% of surface.

## Typography

Two families, both variable, both self-hosted through `next/font/google`.

- **Archivo** (wght 400–700). Body, headings, everything narrative. Chosen as a
  grotesque built for functional typography at small sizes in print. It has the
  slightly compressed, matter-of-fact feel of forms and signage rather than the
  neutral-startup feel of the usual UI sans.
- **Spline Sans Mono** (wght 400–600). Field labels, dates, stack strings, table
  data, section numbering. Used for anything that is data rather than prose.

Reflex picks rejected: Inter, IBM Plex, JetBrains Mono, Space Mono, Space
Grotesk. All are training-data defaults and all appear on developer portfolios
constantly.

### Scale

Modular, ratio 1.333, fluid via `clamp()`:

```
--t-mono-xs   0.6875rem   labels, units          (mono, tracked +0.08em, caps)
--t-body-sm   0.8125rem   table data, metadata
--t-body      0.9375rem   descriptions
--t-lead      1.125rem    summary paragraph
--t-h3        1.25rem     entry titles
--t-h2        1.75rem     section headings
--t-display   clamp(2.5rem, 7vw, 4.5rem)   the name
```

Measure caps at 68ch for prose. Table content is exempt.

## Layout

A strict, visible grid is the voice. Not asymmetry: this is a document, and
documents are ruled.

- Single column, max-width 1080px, generous left margin for the numbering
  gutter on desktop.
- Section structure: a mono label and rule, then rows. Rows are the primary
  unit, not cards. Nothing is wrapped in a card.
- Two-column field rows on desktop (`grid-template-columns: 8.5rem 1fr` for
  labels, wider splits for entries) collapsing to stacked on mobile.
- Vertical rhythm deliberately uneven: tight inside a row group, wide between
  sections. Section gap `clamp(3.5rem, 8vw, 6rem)`, row gap `1.25rem`.

## Components

- **Field row.** Mono uppercase label in the left column, content right.
- **Numbered entry.** Vermilion two-digit index, title, stack string in mono,
  description, status marker. Separated by hairline rules, never boxed.
- **Data table.** Used for experience and the archive. Striped with
  `--paper-sunk`, hairline rules, mono for dates and tags.
- **Status marker.** Small mono caps with a leading dot: `● LIVE`,
  `◐ IN DEVELOPMENT`, `○ ARCHIVED`. Colour on the dot only.

## Motion

Near-none, and that restraint is the voice. A printed document does not animate.

- Link and row hover: 120ms colour and background transition only.
- No entrance animation, no scroll triggers, no parallax.
- `prefers-reduced-motion` respected, though there is little to reduce.

## Accessibility

- Body ink on paper is roughly 13:1. Faint labels on paper stay above 4.5:1.
- The vermilion accent is never the sole carrier of meaning; status markers
  pair colour with a glyph and a word.
- Visible focus ring in the accent, 2px offset.
- Real landmarks and heading order; the document structure is the semantics.
