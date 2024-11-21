/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      //Colors used in this project
      colors:
      {
        primary:"#2BB5FF",
        secondary: "#EF863E"
      },
    },
  },
  plugins: [],
}

