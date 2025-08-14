/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        base: "#f5f2ec",
        accent: "#51213d",
        highlight: "#f5f2ec",
      },
    },
  },
  plugins: [],
};
