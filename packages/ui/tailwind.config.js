const baseTheme = require('./tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['selector', '[data-mode="dark"]'],
  content: ['src/**/*.{ts,tsx}'],
  theme: baseTheme,
  plugins: [require('tailwindcss-animate')],
};
