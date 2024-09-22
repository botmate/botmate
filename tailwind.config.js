/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'packages/{client,ui}/src/**/*.{ts,tsx}',
    'plugins/**/*/src/client/**/*.{ts,tsx}',
  ],
  theme: require('./packages/ui/tailwind.theme.config'),
  plugins: [require('tailwindcss-animate')],
};
