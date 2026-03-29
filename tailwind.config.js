/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tactical: {
          dark: '#0a0d14',
          panel: 'rgba(16, 24, 39, 0.7)',
          primary: '#3b82f6',     // Neon Blue
          secondary: '#8b5cf6',   // Neon Purple
          accent: '#06b6d4',      // Cyan Glow
          alert: '#ef4444',       // Critical Red
          success: '#10b981'      // Terminal Green
        }
      },
      fontFamily: {
        hud: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Rajdhani"', 'sans-serif'],
      },
      backgroundImage: {
        'tactical-grid': "linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)",
        'hud-gradient': "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)"
      },
      backgroundSize: {
        'grid-sm': '20px 20px',
        'grid-lg': '40px 40px',
      },
      boxShadow: {
        'neon-blue': '0 0 15px rgba(59, 130, 246, 0.5)',
        'neon-purple': '0 0 15px rgba(139, 92, 246, 0.5)',
      },
      animation: {
        'hud-pulse': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grid-scroll': 'grid-scroll 20s linear infinite',
      },
      keyframes: {
        'grid-scroll': {
          '0%': { backgroundPosition: '0px 0px' },
          '100%': { backgroundPosition: '40px 40px' },
        }
      }
    },
  },
  plugins: [],
}
