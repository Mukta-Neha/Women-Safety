/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48', // Deep Rose Primary
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        navy: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
        emergency: {
          light: '#fef2f2',
          DEFAULT: '#ef4444',
          dark: '#b91c1c',
        },
        safe: {
          light: '#ecfdf5',
          DEFAULT: '#10b981',
          dark: '#047857',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'sos': '0 0 40px rgba(239, 68, 68, 0.45)',
        'sos-hover': '0 0 60px rgba(239, 68, 68, 0.65)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      }
    },
  },
  plugins: [],
}
