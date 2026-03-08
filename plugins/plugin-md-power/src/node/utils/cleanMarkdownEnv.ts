import type { MarkdownEnv } from 'vuepress/markdown'

/**
 * Clean Markdown Environment
 *
 * 清理后的 Markdown 环境
 */
export interface CleanMarkdownEnv extends MarkdownEnv {
  /**
   * References
   *
   * 引用链接
   */
  references?: unknown
  /**
   * Abbreviations
   *
   * 缩写词
   */
  abbreviations?: unknown
  /**
   * Annotations
   *
   * 注释
   */
  annotations?: unknown
}

/**
 * Whitelist of environment keys to preserve
 *
 * 要保留的环境键白名单
 */
const WHITE_LIST = ['base', 'filePath', 'filePathRelative', 'references', 'abbreviations', 'annotations'] as const

type WhiteListUnion = (typeof WHITE_LIST)[number]

/**
 * Clean markdown environment for inline rendering.
 *
 * 清理 markdown 环境以用于行内渲染。
 *
 * When using `md.renderInline()` in custom renderers, some environment properties
 * may cause issues. This function creates a clean environment object with only
 * the necessary properties preserved.
 *
 * 在自定义渲染器中使用 `md.renderInline()` 时，某些环境属性可能会导致问题。
 * 该函数创建一个只保留必要属性的干净环境对象。
 *
 * @param env - Markdown environment / Markdown 环境
 * @param excludes - Keys to exclude / 要排除的键
 * @returns Cleaned environment / 清理后的环境
 *
 * @example
 * ```ts
 * const cleanEnv = cleanMarkdownEnv(env)
 * const rendered = md.renderInline(content, cleanEnv)
 * ```
 */
export function cleanMarkdownEnv(env: CleanMarkdownEnv, excludes: WhiteListUnion[] = []): CleanMarkdownEnv {
  const result: CleanMarkdownEnv = {}
  for (const key of WHITE_LIST) {
    if (excludes.includes(key))
      continue
    result[key] = env[key] as string
  }
  return result
}
