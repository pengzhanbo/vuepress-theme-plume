const path = require('path')
module.exports = {
  content: ['./lib/**/*.{vue,html,css,ts,tsx,js,jsx}'].map((_) =>
    path.join(__dirname, _)
  ),
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
}
