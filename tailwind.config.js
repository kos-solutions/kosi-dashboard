/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kosi: {
          bg: "#F9FAF7",
          surface: "#FFFFFF",
          primary: "#7EC8B3",
          secondary: "#FFD6A5",
          success: "#9AD0A4",
          warning: "#F4B183",
          text: "#2F3E46",
          muted: "#6B7280",
        },
      },
    },
  },
  plugins: [],
};
