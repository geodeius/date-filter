/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bg: { white: '#ffffff', primary: '#ffffff' },
        text: { primary: '#0a0a0a', placeholder: '#a3a3a3' },
        border: { primary: '#f0f0f0', secondary: '#e5e5e5' },
        hover: '#f5f5f5',
      },
      fontSize: {
        'paragraph-sm': ['14px', { lineHeight: '1.429' }],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
    },
  },
  plugins: [],
};
