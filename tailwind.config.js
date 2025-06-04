/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00c172',
        'text-main': '#2a282b',
      },
    },
  },
  plugins: [],
}
