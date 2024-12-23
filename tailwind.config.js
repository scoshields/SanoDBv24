/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      keyframes: {
        "slide-in-from-top": {
          "0%": { transform: "translateY(-10%)", opacity: 0 },
          "100%": { transform: "translateY(0)", opacity: 1 }
        }
      },
      animation: {
        "in": "slide-in-from-top 0.2s ease-out"
      }
    }
  },
  plugins: []
};