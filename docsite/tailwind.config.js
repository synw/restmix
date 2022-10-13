const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,vue}',
    './node_modules/@snowind/**/*.{vue,js,ts}',
    './node_modules/vuecodit/**/*.{vue,js,ts}',
  ],
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/forms'),
    require('@snowind/plugin'),
    require('tailwindcss-semantic-colors'),
    require('@tailwindcss/typography'),
  ],
  theme: {
    extend: {
      maxWidth: {
        'prose': '100ch',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            'code::before': {
              content: 'normal',
            },
            'code::after': {
              content: 'normal',
            },
          },
        },
      }),
      semanticColors: {
        primary: {
          light: {
            bg: colors.cyan[700],
            txt: colors.white
          },
          dark: {
            bg: colors.slate[900],
            txt: colors.neutral[100]
          }
        },
        secondary: {
          light: {
            bg: colors.cyan[500],
            txt: colors.white
          },
          dark: {
            bg: colors.black,
            txt: colors.neutral[100]
          }
        }
      }
    }
  }
}