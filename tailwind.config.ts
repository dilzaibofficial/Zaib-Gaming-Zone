import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary accent — refined violet/indigo (premium, not neon)
        neon: {
          green:  "#818cf8",   // indigo-400
          blue:   "#6366f1",   // indigo-500
          purple: "#7c3aed",   // violet-600
          pink:   "#a78bfa",   // violet-400
        },
        // Semantic status (keep UX conventions)
        status: {
          available: "#22c55e",
          occupied:  "#ef4444",
          pending:   "#f59e0b",
        },
        // Dark backgrounds — true near-black
        dark: {
          bg:      "#09090b",
          card:    "#111116",
          border:  "#1c1c26",
          surface: "#16161e",
        },
      },
      fontFamily: {
        gaming: ["Orbitron", "monospace"],
        body:   ["Rajdhani", "sans-serif"],
      },
      boxShadow: {
        neon:         "0 0 20px rgba(99,102,241,0.35), 0 0 60px rgba(99,102,241,0.12)",
        "neon-blue":  "0 0 20px rgba(99,102,241,0.3)",
        "neon-purple":"0 0 20px rgba(124,58,237,0.35)",
        card:         "0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset",
        "card-hover": "0 20px 50px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.3), 0 1px 0 rgba(255,255,255,0.06) inset",
        glass:        "0 8px 32px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05) inset",
      },
      animation: {
        "pulse-slow":        "pulse 3s ease-in-out infinite",
        "float":             "float 4s ease-in-out infinite",
        "slide-in-right":    "slideInRight 0.35s cubic-bezier(0.16,1,0.3,1) forwards",
        "slide-out-right":   "slideOutRight 0.25s ease-in forwards",
        "fade-in":           "fadeIn 0.2s ease-out forwards",
        "progress-bar":      "progressBar 3s linear forwards",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        slideInRight: {
          from: { opacity: "0", transform: "translateX(110%)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        slideOutRight: {
          from: { opacity: "1", transform: "translateX(0)" },
          to:   { opacity: "0", transform: "translateX(110%)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        progressBar: {
          from: { width: "100%" },
          to:   { width: "0%" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
