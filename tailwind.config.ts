import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-montserrat)"],
        montserrat: ["var(--font-montserrat)"],
        playfair: ["var(--font-playfair)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        green: {
          DEFAULT: "#323b26",
          "50": "#eaf0e5",
          "100": "#d5e1cc",
          "200": "#bfd1b3",
          "300": "#a9c299",
          "400": "#94b280",
          "500": "#7fa366",
          "600": "#6a934d",
          "700": "#558433",
          "800": "#407419",
          "900": "#2b6500",
        },
        purple: {
          DEFAULT: "#B6BFDC",
          "50": "#f0f2f7",
          "100": "#e1e5f0",
          "200": "#d3d9e8",
          "300": "#c4ccdf",
          "400": "#B6BFDC", // Base color
          "500": "#a2adcb",
          "600": "#8e9ab9",
          "700": "#7a88a8",
          "800": "#667597",
          "900": "#526385",
        },
      },
    },
  },
  plugins: [],
}

export default config
