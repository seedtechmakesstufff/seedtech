import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Brand Colors (from Figma Design Kit) ── */
      colors: {
        dark: {
          base: "#0a0a0f",
          raised: "#0c0c14",
          elevated: "#14141f",
          overlay: "#1a1a28",
        },
        light: {
          base: "#f8f8fa",
          raised: "#ffffff",
        },
        seed: {
          DEFAULT: "#40A660",
          50: "#edfff3",
          100: "#d5ffe4",
          200: "#aeffcb",
          300: "#6fffa4",
          400: "#40d97a",
          500: "#40A660",
          600: "#0f9c45",
          700: "#0f7a3a",
          800: "#116031",
          900: "#104f2a",
          950: "#022c15",
        },
        brand: {
          blue: "#3b82f6",
          cyan: "#06b6d4",
          emerald: "#10b981",
          success: "#10b981",
          error: "#ef4444",
        },
      },

      /* ── Typography ── */
      fontFamily: {
        display: ["var(--font-league-gothic)", "system-ui", "sans-serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      fontSize: {
        display: ["4.5rem", { lineHeight: "1.05", letterSpacing: "0", fontWeight: "400" }],
        title: ["3.5rem", { lineHeight: "1.1", letterSpacing: "0", fontWeight: "400" }],
        "heading-lg": ["2.75rem", { lineHeight: "1.15", letterSpacing: "0", fontWeight: "400" }],
        heading: ["2.25rem", { lineHeight: "1.2", letterSpacing: "0", fontWeight: "400" }],
        subheading: ["1.5rem", { lineHeight: "1.35", letterSpacing: "0", fontWeight: "400" }],
        "card-title": ["1.125rem", { lineHeight: "1.4", letterSpacing: "0", fontWeight: "400" }],
        "body-lg": ["1.125rem", { lineHeight: "1.65", fontWeight: "400" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-sm": ["0.875rem", { lineHeight: "1.55", fontWeight: "400" }],
        eyebrow: ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.08em", fontWeight: "600" }],
        "stat-number": ["3.5rem", { lineHeight: "1.1", letterSpacing: "0", fontWeight: "400" }],
        "step-number": ["2.5rem", { lineHeight: "1.15", letterSpacing: "0", fontWeight: "400" }],
      },

      /* ── Box Shadows (from Figma) ── */
      boxShadow: {
        glowSeed: "0 0 20px rgba(64, 166, 96, 0.15), 0 0 60px rgba(64, 166, 96, 0.05)",
        glowSeedLg: "0 0 40px rgba(64, 166, 96, 0.25), 0 0 80px rgba(64, 166, 96, 0.1)",
        glowBlue: "0 0 20px rgba(59, 130, 246, 0.15), 0 0 60px rgba(59, 130, 246, 0.05)",
        glowCyan: "0 0 20px rgba(6, 182, 212, 0.15), 0 0 60px rgba(6, 182, 212, 0.05)",
        cardDark: "0 1px 2px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.2)",
        cardLight: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        nav: "0 1px 0 rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.3)",
        dropdown: "0 4px 24px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)",
        pricingHighlight: "0 0 40px rgba(64,166,96,0.2), 0 8px 32px rgba(0,0,0,0.3)",
        elevated: "0 2px 8px rgba(0,0,0,0.3), 0 8px 32px rgba(0,0,0,0.2)",
      },

      /* ── Background gradients ── */
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #0f9c45, #10b981)",
        "gradient-it": "linear-gradient(135deg, #40A660, #10b981)",
        "gradient-web": "linear-gradient(135deg, #3b82f6, #06b6d4)",
        "gradient-marketing": "linear-gradient(135deg, #06b6d4, #10b981)",
        "gradient-brand-text": "linear-gradient(135deg, #40d97a, #10b981, #14b8a6)",
        "gradient-glow": "linear-gradient(135deg, rgba(15,156,69,0.1), transparent, rgba(16,185,129,0.1))",
      },

      /* ── Animations ── */
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-reverse": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "fade-in": "fade-in 0.4s ease-out forwards",
        marquee: "marquee 30s linear infinite",
        "marquee-reverse": "marquee-reverse 30s linear infinite",
        float: "float 6s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
