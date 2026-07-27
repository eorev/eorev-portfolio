import { RESEARCH } from "@/lib/content";
import { FieldRow, StatusMarker } from "./Primitives";

export function Research() {
  return (
    <div className="pt-8 sm:pt-10">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 className="text-entry font-semibold">{RESEARCH.title}</h3>
        <StatusMarker status="ongoing" />
      </div>

      <div className="mt-5 max-w-prose space-y-4">
        <p className="text-lead text-ink">{RESEARCH.lead}</p>
        <p className="text-body text-ink-mid">{RESEARCH.body}</p>
      </div>

      <dl className="mt-8 border-t border-rule">
        {RESEARCH.fields.map((field) => (
          <FieldRow key={field.label} label={field.label}>
            {field.value}
          </FieldRow>
        ))}
      </dl>
    </div>
  );
}
