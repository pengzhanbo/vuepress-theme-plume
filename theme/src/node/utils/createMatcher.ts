import type { Matcher } from 'picomatch'
import { toArray, uniq } from '@pengzhanbo/utils'
import picomatch from 'picomatch'

export function createMatcher(include?: string | string[], exclude?: string | string[], cwd?: string): Matcher {
  const pattern: string[] = []
  const ignore: string[] = uniq(['**/node_modules**', '**/.vuepress/**', ...toArray(exclude)])

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

  return picomatch(pattern, { ignore, cwd })
}
