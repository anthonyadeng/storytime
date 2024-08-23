import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-crimson-text)'],
        mono: ['var(--font-roboto)'],
      },
      scale: {
        '200': '2',
        '300': '3',
      },
      blur: {
        xsm: '2px',
        xxsm: '1px',
      },
      duration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      backgroundImage: {
        'gradient-radial-2':
          'radial-gradient(closest-side, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-radial-1and2':
          'radial-gradient(closest-side, var(--tw-gradient-stops)), radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-conic-top':
          'conic-gradient(from 93deg, var(--tw-gradient-stops))',

        'gradient-conic-top-both':
          'conic-gradient(from 93deg, var(--tw-gradient-stops)), conic-gradient(from -89deg, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};
export default config;
