module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#1abc9c',
        secondary: '#9b59b6',
        accent: '#e74c3c',
        bg: '#121212'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(26, 188, 156, 0.5)',
      },
    },
  },
  plugins: [],
};