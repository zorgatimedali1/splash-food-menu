/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        splash: {
          black: '#000000',
          'dark-gray': '#333333',
          gray: '#808080',
          'light-gray': '#EDEDED',
          white: '#FFFFFF',
          border: '#E5E5E5',
          input: '#F5F5F5',
        },
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '16px',
        xl: '12px',
        lg: '8px',
      },
      boxShadow: {
        sm: '0 1px 3px 0 rgb(0 0 0 / 0.05)',
        card: '0 2px 8px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
};
