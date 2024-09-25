/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: ['./src/**/*.tsx'],
  theme: require('@botmate/ui/tailwind.theme.config'),
  plugins: [require('tailwindcss-animate')],
};
