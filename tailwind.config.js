const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./src/features/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx}",
    "./src/libs/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", '[data-mode="dark"]'],
  theme: {
    screens: {
      sm: "640px", // Under smartphone
      md: "768px", // Under Table horizontal
      lg: "1024px", // Under Tablet
      xl: "1440px", // Under laptop
      "2xl": "1920px", // Under fullHD
      "3xl": "2560px", // Under 2K
    },
    extend: {
      screens: {
        "3xl": "2560px", // Under 2K
      },
      // container: false,
      container: {
        center: true,
        padding: {
          DEFAULT: "1.5rem",
          sm: "1.5rem",
          md: "3rem",
          lg: "5rem",
          xl: "11.25rem",
          "2xl": "15rem",
          "3xl": "20rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1440px",
          "2xl": "1920px",
          "3xl": "2560px",
        },
      },

      padding: { full: "100%", 4.5: "1.125rem" },
      colors: {
        primary: {
          600: "#13AF88",
        },
        neutral: {
          0: "#FFFFFF",
          100: "#E7E7E7",
          200: "#C6C6C6",
          300: "#9E9E9E",
          400: "#717171",
          500: "#444444",
          600: "#343434",
          700: "#242424",
          800: "#181818",
          900: "#0D0D0D",
        },
        secondary: {
          lemon: "#9FE864",
        },
      },
      fontSize: {
        tn: ["0.75rem", "1rem"],
        xxs: ["0.813rem", "1.125rem"],
        xs: ["0.875rem", "1.25rem"],
        sm: ["1rem", "1.5rem"],
        base: ["1.125rem", "1.75rem"],

        lg: ["1.5rem", "2rem"],
        xl: ["1.75rem", "2.5rem"],

        h0: ["16rem", "17rem"],
        h1: ["10.5rem", "11.625rem"],
        h2: ["7rem", "7.5rem"],
        h3: ["6.25rem", "7.25rem"],
        h4: ["5rem", "5.75rem"],
        h5: ["4.5rem", "5rem"],
        h6: ["3.5rem", "4rem"],
        h7: ["2.5rem", "3rem"],
        h8: ["2rem", "2.5rem"],
      },
      animation: {
        show: "show 1s ease-in-out",
        "move-up": "move-up 1s ease-in-out",
        rotateX: "rotateX 1s ease-in-out",
        "grow-icon": "grow-icon 0.4s ease-in-out forwards",
        "hide-icon": "hide-icon 0.4s ease-in-out forwards",
      },
      keyframes: {
        show: { "0%": { opacity: 0 }, "50%": { opacity: 0 }, "100%": { opacity: 1 } },
        "move-up": {
          "0%": { transform: "translateY(var(--initY,100px))" },
          "50%": { transform: "translateY(var(--initY,100px))" },
          "100%": { transform: "translateY(var(--finishY,15px))" },
        },
        rotateX: {
          "0%": { transform: "rotateX(-90deg)" },
          "50%": { transform: "rotateX(-90deg)" },
          "100%": { transform: "rotateX(0deg)" },
        },
        "hide-icon": {
          "0%": {
            opacity: 1,
            transform: "scale(1)",
          },
          to: {
            opacity: 0,
            transform: "scale(.5)",
          },
        },
        "grow-icon": {
          "0%": {
            opacity: 0,
            transform: "scale(.5)",
          },
          to: {
            opacity: 1,
            transform: "scale(1)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    plugin(function ({ addComponents, matchUtilities, theme }) {
      matchUtilities(
        {
          "translate-z": (value) => ({
            "--tw-translate-z": value,
            transform: ` translate3d(var(--tw-translate-x), var(--tw-translate-y), var(--tw-translate-z)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))`,
          }), // this is actual CSS
        },
        { values: theme("translate"), supportsNegativeValues: true }
      );
      const utilities = {
        ".center-by-grid": {
          display: "grid",
          "place-items": "center",
          "> *": {
            "grid-column": "1 / -1",
            "grid-row": "1 / -1",
          },
        },
      };
      const scroll = {
        ".custom-scroll": {
          "scrollbar-width": "thin",
          "scrollbar-color": "transparent transparent",
          transition: "scrollbar-color 0.3s ease",
          "-webkit-overflow-scrolling": "touch",
          "pointer-events": "auto",
          "--color-scrollbar": "rgba(90, 90, 90, 0.3)",

          "&:hover,&:focus,&:focus-within": {
            "scrollbar-color": "var(--color-scrollbar) transparent",
          },
        },
      };
      addComponents([utilities, scroll]);
    }),
  ],
};

module.exports = config;
