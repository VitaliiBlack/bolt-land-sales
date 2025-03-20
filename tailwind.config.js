/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      height: {
        'card-img': '12rem',
        'card-content': '16rem',
      },
      colors: {
        'brand-dark': {
          blue: '#1a2b47',
          gray: '#222222',
          black: '#000000'
        },
        'brand-light': {
          white: '#ffffff',
          gray: '#e0e0e0',
          accent: '#030303'
        },
        'discount': {
          red: '#ff3b3b'
        }
      }
    },
  },
  plugins: [],
};
