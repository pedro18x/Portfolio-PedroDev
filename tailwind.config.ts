import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: "#121212",
        light: "#fcfcfc",
        primary: "#6b7280",
        primaryDark: "#d1d5db",
        border: "hsl(0 0% 100% / 0.1)",
        input: "hsl(0 0% 100% / 0.05)",
      },
      animation: {
        "spin-slow": "spin 8s linear infinite",
        shine: "shine 3s ease-in-out infinite alternate",
        'wave-shine': 'wave-shine 2.5s linear infinite',
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
          '100%': { 'background-position': '0% 50%' },
        },
        'wave-shine': {
          '0%':   { 'background-position': '-200% 0%' },
          '100%': { 'background-position': '200% 0%' },
        },
      },
      backgroundImage: {
        circularLight:
          "repeating-radial-gradient(rgba(0,0,0,0.4) 2px, #f5f5f5 5px, #f5f5f5 100px);",
        circularDark:
          "repeating-radial-gradient(rgba(255,255,255,0.5) 2px, #1b1b1b 8px, #1b1b1b 100px);",
      },
    },
  },
  plugins: [],
};
export default config; 