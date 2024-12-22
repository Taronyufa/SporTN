const daisyui = require("daisyui");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      container: {
        center: true, // Center the container
        padding: "1rem", // Optional padding inside the container
      },
    },
  },
  plugins: [daisyui],
}

