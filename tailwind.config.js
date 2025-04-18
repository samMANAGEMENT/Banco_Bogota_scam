module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    animation: {
      bounce: 'bounce 1s infinite',
      bounce200: 'bounce 1s 0.2s infinite',
      bounce400: 'bounce 1s 0.4s infinite',
    },
    keyframes: {
      bounce: {
        '0%, 100%': {
          transform: 'translateY(-25%)',
          animationTimingFunction: 'cubic-bezier(0.8, 0, 0.2, 1)',
        },
        '50%': {
          transform: 'none',
          animationTimingFunction: 'cubic-bezier(0.8, 0, 0.2, 1)',
        },
      },
    },
  },
  plugins: [],
}