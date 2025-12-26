import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#20BEFF',
        'kaggle-blue': '#20BEFF',
        'kaggle-navy': '#1A202C',
        'kaggle-dark': '#2D3748',
        'kaggle-light': '#F7FAFC'
      },
      boxShadow: {
        card: '0 2px 8px rgba(0,0,0,0.08)',
        'card-hover': '0 4px 16px rgba(0,0,0,0.12)'
      },
      borderRadius: {
        'kaggle': '4px'
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
