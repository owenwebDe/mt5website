/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0E11',
          card: '#14181C',
          hover: '#1A1F24',
          border: '#2A2F35'
        },
        accent: {
          green: '#00FF94',
          cyan: '#00D9FF',
          red: '#FF3B69',
          yellow: '#FFB800'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      }
    },
  },
  plugins: [],
}
