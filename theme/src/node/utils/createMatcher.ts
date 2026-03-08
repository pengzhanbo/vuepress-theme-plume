import type { Matcher } from 'picomatch'
import { toArray, uniq } from '@pengzhanbo/utils'
import picomatch from 'picomatch'

/**
 * Resolve include and exclude patterns into pattern and ignore arrays.
 * Converts various pattern formats into a standardized format for matching.
 *
 * 将 include 和 exclude 模式解析为 pattern 和 ignore 数组。
 * 将各种模式格式转换为用于匹配的标准化格式。
 *
 * @param include - Patterns to include, can be string or array / 要包含的模式，可以是字符串或数组
 * @param exclude - Patterns to exclude, can be string or array / 要排除的模式，可以是字符串或数组
 * @returns Object containing pattern and ignore arrays / 包含 pattern 和 ignore 数组的对象
 */
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

/**
 * Create a file matcher function using picomatch.
 * Returns a function that tests if a file path matches the given patterns.
 *
 * 使用 picomatch 创建文件匹配器函数。
 * 返回一个测试文件路径是否匹配给定模式的函数。
 *
 * @param include - Patterns to include / 要包含的模式
 * @param exclude - Patterns to exclude / 要排除的模式
 * @param cwd - Current working directory for relative path matching / 用于相对路径匹配的当前工作目录
 * @returns Matcher function that tests file paths / 测试文件路径的匹配器函数
 */
export function createMatcher(include?: string | string[], exclude?: string | string[], cwd?: string): Matcher {
  exclude = ['**/node_modules/**', '**/.vuepress/**', ...toArray(exclude)]
  const { pattern, ignore } = resolveMatcherPattern(include, exclude)

  return picomatch(pattern, { ignore, cwd })
}
