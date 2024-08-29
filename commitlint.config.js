import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const packages = fs.readdirSync(path.resolve(__dirname, 'plugins'))

export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['docs', 'theme', 'cli', ...packages]],
    'footer-max-line-length': [0],
  },
}
