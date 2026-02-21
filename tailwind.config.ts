import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './providers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        zalando: ['ZalandoSans', 'sans-serif'],
      },
      colors: {
        'pa-black': '#050505',
        'pa-platinum': '#C9B99A',
      },
      letterSpacing: {
        ultra: '0.35em',
        'wide-xl': '0.25em',
      },
    },
  },
  plugins: [],
}

export default config
