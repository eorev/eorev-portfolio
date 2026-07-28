import { PLATES } from "./content";

/**
 * The document's numbered divisions, in order. Numbering is derived rather
 * than hard-coded so a section can drop out without leaving a gap in the
 * sequence or a stale entry in the contents list.
 */
export const SECTIONS = [
  { id: "systems", title: "Systems" },
  { id: "research", title: "Research" },
  { id: "experience", title: "Experience" },
  { id: "stack", title: "Stack" },
  ...(PLATES.length > 0 ? [{ id: "life", title: "Life" }] : []),
  { id: "archive", title: "Archive" },
].map((section, i) => ({
  ...section,
  index: String(i + 1).padStart(2, "0"),
  href: `#${section.id}`,
}));

export function sectionIndex(id: string): string {
  return SECTIONS.find((s) => s.id === id)?.index ?? "";
}

export const hasLife = PLATES.length > 0;
