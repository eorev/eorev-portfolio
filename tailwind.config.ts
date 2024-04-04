import type { Config } from "tailwindcss"
const { fontFamily } = require("tailwindcss/defaultTheme")

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#5866f2",
        "primary-content": "#ffffff",
        "primary-dark": "#293bee",
        "primary-light": "#8791f6",

        secondary: "#f25899",
        "secondary-content": "#460520",
        "secondary-dark": "#ee297c",
        "secondary-light": "#f687b6",

        background: "#131420",
        'background-light': '#252734',
        foreground: "#1d1e30",
        border: "#303350",

        copy: "#fafafc",
        "copy-light": "#cfd1e2",
        "copy-lighter": "#8f93bc",

        success: "#58f258",
        warning: "#f2f258",
        error: "#f25858",

        "success-content": "#054605",
        "warning-content": "#464605",
        "error-content": "#460505"
    },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config