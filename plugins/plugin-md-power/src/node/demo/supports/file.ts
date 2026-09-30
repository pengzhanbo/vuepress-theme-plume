import type { App } from 'vuepress'
import type { MarkdownEnv } from 'vuepress/markdown'
import fs from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import process from 'node:process'
import { colors } from 'vuepress/utils'
import { logger } from '../../utils/logger.js'

const require = createRequire(process.cwd())

const SOURCE_ALIAS = '@source/'

/**
 * Find a file referenced by the demo / code-tree syntax.
 *
 * 查找由 demo / code-tree 语法引用的文件。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param env - Markdown environment / Markdown 环境
 * @param url - Referenced url / 被引用的地址
 * @returns Resolved absolute path, or an empty string when the url is rejected / 解析后的绝对路径，地址被拒绝时返回空字符串
 */
export function findFile(app: App, env: MarkdownEnv, url: string): string {
  if (url.startsWith('/'))
    return resolveSourceFile(app, env, url.slice(1))

  if (url.startsWith('./') || url.startsWith('../'))
    return resolveSourceFile(app, env, path.join(path.dirname(env.filePathRelative!), url))

  if (url.startsWith(SOURCE_ALIAS))
    return resolveSourceFile(app, env, url.slice(SOURCE_ALIAS.length))

  try {
    return require.resolve(url)
  }
  catch {
    return url
  }
}

/**
 * Resolve a path relative to the source directory, rejecting any path that escapes it.
 *
 * 将路径解析到 source 目录内，并拒绝任何越出 source 目录的路径（防目录穿越）。
 *
 * @param app - VuePress app / VuePress 应用实例
 * @param env - Markdown environment / Markdown 环境
 * @param relativePath - Path relative to the source directory / 相对于 source 目录的路径
 * @returns Resolved absolute path, or an empty string when it escapes the source directory / 解析后的绝对路径，越界时返回空字符串
 */
function resolveSourceFile(app: App, env: MarkdownEnv, relativePath: string): string {
  const sourceDir = app.dir.source()
  const resolved = path.resolve(sourceDir, relativePath)
  const relative = path.relative(sourceDir, resolved)

  // `..` or `../xxx` means the target is outside the source directory.
  // `path.isAbsolute` additionally covers cross-drive paths on Windows.
  // `..` 或 `../xxx` 表示目标位于 source 目录之外；`path.isAbsolute` 额外覆盖 Windows 跨盘符路径。
  if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
    logger.warn(
      'resolve-file',
      `Refused to read a file outside the source directory: ${colors.yellow(relativePath)}\n  at: ${colors.gray(env.filePathRelative || '')}`,
    )
    return ''
  }

  return resolved
}

export function readFileSync(filepath: string): string | false {
  try {
    return fs.readFileSync(filepath, 'utf-8')
  }
  catch {
    return false
  }
}

export function writeFileSync(filepath: string, content: string): void {
  const dirname = path.dirname(filepath)
  fs.mkdirSync(dirname, { recursive: true })
  fs.writeFileSync(filepath, content, 'utf-8')
}
