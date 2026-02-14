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
 * Clean markdown environment, keeping only whitelisted keys
 *
 * 清理 Markdown 环境，仅保留白名单中的键
 *
 * @param env - Markdown environment / Markdown 环境
 * @param excludes - Keys to exclude / 要排除的键
 * @returns Cleaned environment / 清理后的环境
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
