import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
      colors: {
        'international-orange': '#FF4F00',
        'international-orange-engineering': '#BA160C',
        'disabled': '#9ca3af',
        'disabled-dark': '#4b5563',
        'gray-600': '#4b5563',
        'gray-50': '#f9fafb',
        'bgLight': '#e2deda',
        'bgDark': '#1a1a1a',
        'green-500': '#4e9a06',
      },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
