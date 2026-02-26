/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Palette principale Sauvage Watches
        primary: '#0f2a1d', // Vert foncé
        'primary-hover': '#163d2a', // Vert foncé - état hover
        cream: {
          DEFAULT: '#f7ede0', // Beige clair
          100: '#ede4d8', // Crème plus foncé (hover, états secondaires)
          200: '#e3d9cc', // Crème encore plus foncé (skeleton, placeholders)
          300: '#d9cec0', // Crème sombre (skeleton loaders)
        },
        'text-main': '#000000', // Noir
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [],
}
