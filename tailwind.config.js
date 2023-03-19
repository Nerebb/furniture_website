/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var"],
      },
      spacing: {
        25: "6.25rem",
      },
      colors: {
        priBlack: {
          50: "#EDEDED",
          100: "#DBDBDB",
          200: "#BABABA",
          300: "#969696",
          400: "#737373",
          500: "#505050",
          600: "#404040",
          700: "#303030",
          800: "#212121",
          900: "#0F0F0F",
        },
        priBlue: {
          50: "#F4F8FB",
          100: "#E9F0F7",
          200: "#D2E1EE",
          300: "#C0D5E7",
          400: "#AAC6DF",
          500: "#94B8D7",
          600: "#5F95C3",
          700: "#3C71A0",
          800: "#274A68",
          900: "#132534",
        },
        red: {
          50: "#FFF5F5",
          100: "#FFE6E6",
          200: "#FED2D2",
          300: "#FEB9B9",
          400: "#FDA0A0",
          500: "#FD8A8A",
          600: "#FC3B3B",
          700: "#E70404",
          800: "#9B0303",
          900: "#4B0101",
        },
      },
      screens: {
        mobile: "450px",
        laptop: "1024px",
        desktop: "1440px",
      },
      outlineWidth: {
        0.5: "0.5px",
      },
      borderWidth: {
        0.5: "0.5px",
      },
      borderRadius: {
        "4xl": "2.5rem",
      },
      strokeWidth: {
        5: "5px",
      },
      transitionDuration: {
        0: "0ms",
        2000: "2000ms",
      },
      transitionProperty: {
        height: "height",
        spacing: "margin, padding",
        stroke: "stroke-dashoffset",
      },
      transitionDuration: {
        2000: "2000",
        5000: "5000",
      },
      aspectRatio: {
        "3/4": "3/4",
        "4/3": "5/3",
      },
      backdropBlur: {
        1: "1px",
      },
      flexGrow: {
        2: "2",
        3: "3",
        4: "4",
        5: "5",
        6: "6",
        7: "7",
        8: "8",
        9: "9",
        10: "10",
      },
      animation: {
        flip: "flip 0.5s forwards",
      },
      keyframes: {
        flip: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(180deg)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
