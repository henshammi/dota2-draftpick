import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dota-red': {
          DEFAULT: '#ef4444',
          dark: '#991b1b',
          glow: '#f87171',
        },
        'dota-green': {
          DEFAULT: '#10b981',
          dark: '#065f46',
          glow: '#34d399',
        },
        'dota-gold': {
          DEFAULT: '#f59e0b',
          light: '#fcd34d',
          dark: '#b45309',
        },
        'dota-cyan': {
          DEFAULT: '#06b6d4',
          light: '#38bdf8',
        },
        'dota-dark': {
          950: '#07090e',
          900: '#0c1017',
          850: '#111722',
          800: '#172030',
          700: '#233048',
        },
        attr: {
          str: '#f87171',
          agi: '#4ade80',
          int: '#38bdf8',
          uni: '#c084fc',
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        outfit: ['Outfit', 'sans-serif'],
        rajdhani: ['Rajdhani', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px -3px rgba(245, 158, 11, 0.45)',
        'glow-red': '0 0 20px -3px rgba(239, 68, 68, 0.45)',
        'glow-green': '0 0 20px -3px rgba(16, 185, 129, 0.45)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.45)',
      }
    },
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        dota: {
          "primary": "#f59e0b",
          "secondary": "#ef4444",
          "accent": "#10b981",
          "neutral": "#172030",
          "base-100": "#0c1017",
          "base-200": "#111722",
          "base-300": "#1a2334",
          "info": "#06b6d4",
          "success": "#10b981",
          "warning": "#f59e0b",
          "error": "#ef4444",
        },
      },
      "dark",
      "night",
    ],
  },
};
