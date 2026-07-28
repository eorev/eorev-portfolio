import { STACK } from "@/lib/content";

export function Stack() {
  return (
    <dl className="mt-2">
      {STACK.map((group) => (
        <div
          key={group.group}
          className="grid grid-cols-1 gap-x-8 gap-y-1 border-b border-rule py-3 sm:grid-cols-[8.5rem_1fr]"
        >
          <dt className="label pt-1">{group.group}</dt>
          <dd className="font-mono text-meta leading-relaxed text-ink">
            {group.items.map((item, i) => (
              <span key={item}>
                {i > 0 && <span className="px-1.5 text-rule-strong">/</span>}
                {item}
              </span>
            ))}
          </dd>
        </div>
      ))}
    </dl>
  );
}
