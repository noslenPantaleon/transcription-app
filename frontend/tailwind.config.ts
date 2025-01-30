import type { Config } from "tailwindcss";


export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
     './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: "class", // Enable dark mode class-based
  theme: {
    extend: {
      colors: {
        primary: "#1f2937", // Custom primary color for dark theme
        secondary: "#4b5563",
        gradientStart: "#13294b", // Custom gradient colors
        gradientEnd: "#05050b",
      },
      
    },
  },
  plugins: [],
} satisfies Config;
