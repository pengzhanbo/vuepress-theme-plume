import type { ThemeObject } from 'vuepress'
import { fs, path } from 'vuepress/utils'
import { resolve } from '../utils/index.js'

export function setupAlias(): ThemeObject['alias'] {
  return {
    ...Object.fromEntries(
      fs.readdirSync(
        resolve('client/components'),
        { encoding: 'utf-8', recursive: true },
      )
        .filter(file => file.endsWith('.vue'))
        .map(file => [
          path.join('@theme', file),
          resolve('client/components', file),
        ]),
    ),
  }
}
