const baseTheme = require('./tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  theme: baseTheme,
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [require('tailwindcss-animate')],
};
