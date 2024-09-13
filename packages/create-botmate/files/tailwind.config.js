const theme = require('@botmate/ui/tailwind.theme.config');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./packages/*/src/client/**/*.tsx'],
  corePlugins: { preflight: false },
  theme: theme,
  plugins: [require('tailwindcss-animate')],
};
