/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chai: {
          light: '#F9E4C8',
          medium: '#C58940',
          dark: '#884A39'
        },
        kerala: {
          green: {
            light: '#75AA74',
            DEFAULT: '#1A5D1A',
            dark: '#0F3D0F'
          }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};