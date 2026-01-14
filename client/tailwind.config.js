/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Lexend"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        'premier-dark': '#37003c',
        'premier-blue': '#034a6d',
        'premier-cyan': '#00aaff',
      },
      backgroundImage: {
        'premier-gradient': 'linear-gradient(90deg, rgba(0, 170, 255, 1) 0%, rgba(172, 12, 235, 1) 100%)',
        'premier-gradient-dark': 'linear-gradient(90deg, rgb(2, 141, 211) 0%, rgb(132, 10, 180) 100%)',
      },
      borderRadius: {
        '3xl': '25px',
      },
      boxShadow: {
        'premier': '0 4px 8px rgba(0, 0, 0, 0.2)',
        'premier-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
      },
      fontSize: {
        '2xs': '10pt',
        '10': '40pt',
        '12': '46pt',
        '14': '80pt',
        'base': '16pt',
        'lg': '18pt',
        'xl': '24pt',
        '2xl': '32pt',
      },
    },
  },
  plugins: [],
}

