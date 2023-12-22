const fs = require('fs')
const path = require('path')

const packages = fs.readdirSync(path.resolve(__dirname, 'plugins'))

module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['docs', 'theme', ...packages]],
    'footer-max-line-length': [0],
  },
}
