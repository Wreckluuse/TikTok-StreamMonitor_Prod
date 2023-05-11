
/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      "business", "night", "luxury", "coffee", "forest", "halloween", "dracula"
    ],
  },
  plugins: [
    require('daisyui')
    ],
}