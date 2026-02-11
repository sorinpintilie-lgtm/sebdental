import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "rgb(var(--bg) / <alpha-value>)",
        fg: "rgb(var(--fg) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
        copper: "rgb(var(--copper) / <alpha-value>)",
        violet: "rgb(var(--violet) / <alpha-value>)",
        mint: "rgb(var(--mint) / <alpha-value>)",
        background: "rgb(var(--bg) / <alpha-value>)",
        foreground: "rgb(var(--fg) / <alpha-value>)",
        card: "rgb(var(--surface) / <alpha-value>)",
        ring: "rgb(var(--violet) / <alpha-value>)",
        muted: "rgb(var(--fg) / 0.06)",
        "muted-foreground": "rgb(var(--fg) / 0.6)",
      },
      boxShadow: {
        soft: "0 2px 10px rgb(var(--fg) / 0.05)",
      },
    },
  },
  plugins: [],
} satisfies Config;

