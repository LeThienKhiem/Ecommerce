import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          gray: {
            50: "#f5f5f7",
            100: "#e8e8ed",
            900: "#1d1d1f",
          },
          blue: "#0071e3",
        },
      },
    },
  },
  plugins: [],
};
export default config;

