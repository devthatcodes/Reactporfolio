/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        zincbg: '#09090B',
        surface: '#111115',
        borderzinc: '#27272A',
        crisp: '#FAFAFA',
        cyanaccent: '#22D3EE',
        violetaccent: '#8B5CF6',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'aether-gradient': 'linear-gradient(135deg, #22D3EE 0%, #8B5CF6 100%)',
      },
    },
  },
  plugins: [],
};
