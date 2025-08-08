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
        obsidian: {
          bg: '#202020',
          'bg-secondary': '#262626',
          'bg-hover': '#2a2a2a',
          border: '#404040',
          text: '#dcddde',
          'text-muted': '#999',
          'text-faint': '#666',
          accent: '#7f6df2',
          'accent-hover': '#8b7ff3',
          success: '#4caf50',
          warning: '#ff9800',
          error: '#f44336'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
  ],
}