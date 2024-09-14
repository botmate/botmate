const baseTheme = require('./tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: baseTheme,
  plugins: [require('tailwindcss-animate')],
};
