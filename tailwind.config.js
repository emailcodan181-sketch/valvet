/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'bg-primary':   '#0a0b12',
        'bg-secondary': '#0f1022',
        'bg-tertiary':  '#141629',
        'neon-purple':  '#9d4edd',
        'neon-pink':    '#ff2d78',
        'neon-cyan':    '#00f5ff',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Share Tech Mono"', '"Orbitron"', 'monospace'],
      },
    },
  },
  plugins: [],
}
