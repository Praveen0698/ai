import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-custom-1": "linear-gradient(217.92deg, #EFF8FA 4.32%, #C5DCF7 95.61%)",
        "gradient-custom-2": "linear-gradient(285.17deg, #CED7FF -3.31%, #87A1FF 80.62%)",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        abadi: ['AbadiMTStd', 'sans-serif'],
        aptos: ['Aptos', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'], 
      },
      fontSize: {
        'custom-lg': ['2.8rem', { lineHeight: '3.5rem' }], // Font size: 2.8rem (44.8px), Line height: 3.5rem
      },
    },
  },
  plugins: [],
};
export default config;
