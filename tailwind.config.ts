import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      colors: {
        pastel: {
          purple: "#f4f2ff",
          purpleIcon: "#7c3aed",
          yellow: "#fffbf0",
          yellowIcon: "#f59e0b",
          pink: "#fff2f5",
          pinkIcon: "#f43f5e",
          green: "#f0fbf6",
          greenIcon: "#10b981",
          blue: "#eff6ff",
          blueIcon: "#3b82f6",
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
};
export default config;
