/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FBF8F3',
        'cream-dark': '#F2ECE1',
        espresso: '#1E1612',
        umber: '#3A2A22',
        terracotta: '#C85A32',
        'terracotta-dark': '#A84623',
        sage: '#5E7461',
        'sage-light': '#E9EFEA',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['DM Sans', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        editorial: '0 20px 45px -15px rgba(30, 22, 18, 0.1)',
        card: '0 8px 30px -10px rgba(30, 22, 18, 0.08)',
      },
    },
  },
  plugins: [],
};
