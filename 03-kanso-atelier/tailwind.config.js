/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        alabaster: '#F7F5F0',
        stone: '#EFECE6',
        charcoal: '#1C1B19',
        taupe: '#78736A',
        bronze: '#9A7B4F',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        editorial: '0.18em',
        widest: '0.24em',
      },
    },
  },
  plugins: [],
};
