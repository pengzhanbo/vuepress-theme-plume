import { fs } from '@vuepress/utils'
import { resolveClient } from './utils'

export const getAlias = (): Record<string, string> => {
  return Object.fromEntries(
    fs
      .readdirSync(resolveClient('components'))
      .filter((file) => file.endsWith('.vue'))
      .map((file) => [
        `@theme-plume/${file}`,
        resolveClient('components', file),
      ])
  )
}
