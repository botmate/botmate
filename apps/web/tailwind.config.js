const { nextui } = require('@nextui-org/react');
const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}',
    ),
    ...createGlobPatternsForDependencies(__dirname),
    join(
      __dirname,
      '..',
      '..',
      'node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ),
  ],
  theme: {
    extend: {},
    fontFamily: {
      sans: ['Poppins', 'sans-serif'],
    },
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          colors: {
            primary: {
              DEFAULT: '#292929',
              foreground: '#FFFFFF',
            },
            secondary: {
              DEFAULT: '#1c1c1c',
              foreground: '#FFFFFF',
            },
          },
        },
      },
    }),
  ],
};
