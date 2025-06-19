/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'dark-primary': '#1E2433',
        'dark-secondary': '#2C3549',
        'dark-tertiary': '#3A4556'
      },
      textColor: {
        'dark-primary': '#F0F4F8',
        'dark-secondary': '#B0B8C0'
      },
      borderColor: {
        'dark-border': '#3A4556'
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}

