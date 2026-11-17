/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#0A0A0C',
        surface: '#131318',
        ivory: '#F5F2EB',
        lime: '#C8FF32',
        indigoGlow: '#6366F1',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(245, 242, 235, 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(245, 242, 235, 0.04) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-sm': '48px 48px',
      },
    },
  },
  plugins: [],
}
