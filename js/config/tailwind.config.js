/**
 * PARADICE - CONFIGURACIÓN CENTRALIZADA DE TAILWIND PLAY CDN
 * Paleta de colores oficiales, tipografías, animaciones y keyframes neón.
 */

window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        paradice: {
          bg: '#040814',
          surface: '#090f20',
          cyan: '#00f0ff',
          pink: '#ff007f',
          purple: '#9333ea',
          gold: '#facc15',
          green: '#22c55e',
          ice: '#38bdf8'
        },
        brand: {
          cyan: '#00f0ff',
          blue: '#0284c7',
          pink: '#ff007f',
          purple: '#9333ea',
          gold: '#facc15'
        }
      },
      animation: {
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'glow-red': 'glowRed 1.2s ease-in-out infinite alternate',
        'float': 'float 4s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shake': 'shake 0.5s cubic-bezier(.36,.07,.19,.97) both',
        'laser': 'laserMove 1.2s cubic-bezier(0.4, 0, 0.2, 1) infinite alternate',
        'laser-scan': 'laserScan 1.2s ease-in-out infinite alternate',
        'dice-roll': 'diceRoll 0.8s ease-in-out'
      },
      keyframes: {
        diceRoll: {
          '0%': { transform: 'rotate(0deg) scale(0.9)' },
          '25%': { transform: 'rotate(-25deg) scale(1.1)' },
          '50%': { transform: 'rotate(25deg) scale(0.95)' },
          '75%': { transform: 'rotate(-10deg) scale(1.05)' },
          '100%': { transform: 'rotate(0deg) scale(1)' }
        },
        laserScan: {
          '0%': { opacity: '0.4', transform: 'scaleX(0.95)' },
          '100%': { opacity: '1', transform: 'scaleX(1.05)' }
        },
        glowPulse: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.05)' }
        },
        glowRed: {
          '0%': { boxShadow: '0 0 15px rgba(244, 63, 94, 0.5)' },
          '100%': { boxShadow: '0 0 35px rgba(244, 63, 94, 0.95)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(3px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' }
        }
      }
    }
  }
};
