/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        caribbean: {
          blue: '#0077be',
          teal: '#008080',
          green: '#00a86b',
          sand: '#f4e4bc',
          coral: '#ff7f50'
        },
        coral: {
          50: '#fff5f3',
          100: '#ffe8e1',
          200: '#ffd4c7',
          300: '#ffb8a0',
          400: '#ff8f6b',
          500: '#ff7f50',
          600: '#ed5a2b',
          700: '#c8441f',
          800: '#a5391e',
          900: '#87341f',
        }
      }
    },
  },
  plugins: [],
};