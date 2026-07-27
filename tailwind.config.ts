import type { Config } from "tailwindcss";

const config = {
  content: ["./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-archivo)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: [
          "var(--font-spline-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "monospace",
        ],
      },
      colors: {
        paper: "var(--paper)",
        "paper-sunk": "var(--paper-sunk)",
        "paper-raised": "var(--paper-raised)",
        rule: "var(--rule)",
        "rule-strong": "var(--rule-strong)",
        ink: "var(--ink)",
        "ink-mid": "var(--ink-mid)",
        "ink-faint": "var(--ink-faint)",
        signal: "var(--signal)",
        "signal-wash": "var(--signal-wash)",
      },
      fontSize: {
        label: ["0.75rem", { lineHeight: "1.2", letterSpacing: "0.09em" }],
        meta: ["0.8125rem", { lineHeight: "1.45" }],
        data: ["0.875rem", { lineHeight: "1.5" }],
        body: ["1rem", { lineHeight: "1.62" }],
        lead: ["1.0625rem", { lineHeight: "1.6" }],
        entry: ["1.375rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        section: ["1.5rem", { lineHeight: "1.15", letterSpacing: "-0.02em" }],
        display: [
          "clamp(2.75rem, 9vw, 5rem)",
          { lineHeight: "0.94", letterSpacing: "-0.035em" },
        ],
      },
      maxWidth: {
        doc: "72rem",
        prose: "68ch",
      },
      spacing: {
        gutter: "clamp(1.25rem, 4vw, 3.5rem)",
        section: "clamp(3.25rem, 7vw, 5.5rem)",
      },
      transitionTimingFunction: {
        "out-quart": "cubic-bezier(0.25, 1, 0.5, 1)",
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
