const theme = require('@botmate/ui/tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./packages/**/*.{js,jsx,ts,tsx}'],
  corePlugins: { preflight: false },
  theme: theme,
  plugins: [require('tailwindcss-animate')],
};
