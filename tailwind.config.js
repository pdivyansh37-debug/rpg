/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#0a0a14',
          panel: '#101026',
          border: '#1f1d42',
          neonPink: '#ff2a85',
          neonCyan: '#00f0ff',
          neonGold: '#ffb703',
          neonPurple: '#9d4edd',
          neonAmber: '#fb8500',
          neonGreen: '#06d6a0',
          bossRed: '#e63946',
        },
        rpg: {
          gold: '#F59E0B',
          arcane: '#6366F1',
          crimson: '#F43F5E',
          emerald: '#10B981',
          void: '#020617',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 15px rgba(0, 240, 255, 0.45)',
        'neon-pink': '0 0 20px rgba(255, 42, 133, 0.45)',
        'neon-gold': '0 0 18px rgba(255, 183, 3, 0.45)',
        'neon-purple': '0 0 20px rgba(157, 78, 221, 0.45)',
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
};
