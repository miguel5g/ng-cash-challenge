const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/pages/**/*.tsx', './src/components/**/*.tsx'],
  theme: {
    extend: {
      animation: {
        enter: 'shade-in 0.15s ease-in-out',
        leave: 'shade-out 0.15s ease-in-out',
      },
      boxShadow: {
        'solid-sm': '0.25rem 0.25rem rgba(0, 0, 0, 1)',
        'solid-md': '0.5rem 0.5rem rgba(0, 0, 0, 1)',
        'solid-lg': '0.75rem 0.75rem rgba(0, 0, 0, 1)',
        'solid-xl': '1rem 1rem rgba(0, 0, 0, 1)',
      },
      fontFamily: {
        sans: ['IBM Plex Sans', ...fontFamily.sans],
      },
      keyframes: {
        'shade-in': {
          '0%': { opacity: 0, transform: 'scale(0.8)' },
          '100%': { opacity: 1, transform: 'scale(1)' },
        },
        'shade-out': {
          '0%': { opacity: 1, transform: 'scale(1)' },
          '100%': { opacity: 0, transform: 'scale(0.8)' },
        },
      },
    },
  },
  plugins: [],
};
