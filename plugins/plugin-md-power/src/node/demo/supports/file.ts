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

  // The lexical path and its real path (with symlinks resolved) must both stay inside the
  // source directory. Otherwise a symlink pointing outside the source directory — or any
  // existing symlink in the path — could bypass the check and expose external files.
  // 词法路径与其真实路径（解析符号链接后）都必须位于 source 目录内，
  // 否则指向源目录外部的符号链接（或路径中已存在的符号链接）可绕过检查，读取到外部文件。
  if (isOutside(sourceDir, resolved) || isOutside(realpath(sourceDir), realpath(resolved))) {
    logger.warn(
      'resolve-file',
      `Refused to read a file outside the source directory: ${colors.yellow(relativePath)}\n  at: ${colors.gray(env.filePathRelative || '')}`,
    )
    return ''
  }

  return resolved
}

/**
 * Check whether `target` is located outside `base`.
 *
 * 判断 `target` 是否位于 `base` 之外。
 *
 * @param base - Base directory / 基准目录
 * @param target - Target path / 目标路径
 * @returns `true` when the target escapes the base directory / 目标越出基准目录时返回 `true`
 */
function isOutside(base: string, target: string): boolean {
  const relative = path.relative(base, target)
  // `..` or `../xxx` means outside; `path.isAbsolute` additionally covers cross-drive paths on Windows.
  // `..` 或 `../xxx` 表示越界；`path.isAbsolute` 额外覆盖 Windows 跨盘符路径。
  return relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)
}

/**
 * Resolve symlinks without throwing when the target does not exist.
 *
 * 解析符号链接，目标不存在时不抛出异常。
 *
 * @param target - Target path / 目标路径
 * @returns Real path, or the path with its deepest existing ancestor resolved / 真实路径，或已解析最深已存在祖先目录后的路径
 */
function realpath(target: string): string {
  try {
    return fs.realpathSync(target)
  }
  catch {
    // The target may not exist yet (e.g. a demo file that has not been created). Resolve the
    // deepest existing ancestor so that symlinks already present in the path are still followed.
    // 目标可能尚不存在（如尚未创建的演示文件）。解析最深的已存在祖先目录，
    // 以便仍然跟随路径中已存在的符号链接。
    const parent = path.dirname(target)
    return parent === target ? target : path.join(realpath(parent), path.basename(target))
  }
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
