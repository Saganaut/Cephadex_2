/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/common/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      extend: {
        display: ["responsive"],
      },
      colors: {
        "electric-violet": {
          DEFAULT: "#6019FF",
          100: "#4E26A5",
        },
        "blaze-orange": {
          DEFAULT: "#FF6E0B",
        },
        "mariana-blue": {
          DEFAULT: "#260078",
        },
        tolopea: {
          DEFAULT: "#190042",
        },
        aquamarine: {
          DEFAULT: "#54FFF1",
          100: "#B0FFF8",
          900: "#5AE6DA",
        },
        "black-white": {
          DEFAULT: "#FFFFFD",
        },
        "black-russian": {
          DEFAULT: "#13002A",
        },
      },
    },
    plugins: [],
  },
};
