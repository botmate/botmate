const theme = require('@botmate/ui/tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: theme,
  plugins: [require('tailwindcss-animate')],
};
