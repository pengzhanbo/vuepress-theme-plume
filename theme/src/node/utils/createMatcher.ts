import type { Matcher } from 'picomatch'
import { toArray, uniq } from '@pengzhanbo/utils'
import picomatch from 'picomatch'

export function resolveMatcherPattern(include?: string | string[], exclude?: string | string[]): {
  pattern: string[]
  ignore: string[]
} {
  const pattern: string[] = []
  const ignore: string[] = uniq(toArray(exclude))

  if (!include || include.length === 0) {
    pattern.push('**/*.md')
  }
  else {
    toArray(include).forEach((item) => {
      if (item.startsWith('!')) {
        ignore.push(item.slice(1))
      }
      else {
        pattern.push(item)
      }
    })
  }

  return { pattern, ignore }
}

export function createMatcher(include?: string | string[], exclude?: string | string[], cwd?: string): Matcher {
  exclude = ['**/node_modules/**', '**/.vuepress/**', ...toArray(exclude)]
  const { pattern, ignore } = resolveMatcherPattern(include, exclude)

  return picomatch(pattern, { ignore, cwd })
}
