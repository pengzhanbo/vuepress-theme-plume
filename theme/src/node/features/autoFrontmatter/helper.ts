import { attemptAsync, kebabCase } from '@pengzhanbo/utils'
import { ensureLeadingSlash, removeLeadingSlash } from 'vuepress/shared'
import { fs, path } from 'vuepress/utils'
import { getPinyin, hasPinyin, normalizePath } from '../../utils/index.js'
import { formatPostDate } from '../page-meta.js'

export const EXCLUDE = ['!**/.vuepress/**', '!**/node_modules/**']

const NUMBER_RE = /^\d+\./

export function isReadme(filepath: string): boolean {
  return filepath.endsWith('README.md') || filepath.endsWith('index.md') || filepath.endsWith('readme.md')
}

/**
 * Whether the file is the README of the given directory
 *
 * 判断文件是否为指定目录下的 README。
 *
 * 传入的路径可能来自不同的来源（`node:path` 拼接的结果在 Windows 上使用 `\`），
 * 因此两侧都先归一化再比较，避免同一份文件在不同平台上得出相反的结论。
 *
 * @param filepath - File path to check / 要检查的文件路径
 * @param segments - Directory segments relative to the site root / 相对于站点根目录的目录片段
 * @returns Whether the file is the README of the directory / 是否为该目录的 README
 */
export function isDirReadme(filepath: string, ...segments: string[]): boolean {
  return normalizePath(filepath).endsWith(normalizePath(path.join(...segments, 'README.md')))
}

export function normalizeTitle(title: string): string {
  return title.replace(NUMBER_RE, '').trim()
}

export async function getFileCreateTime(filepath: string): Promise<string> {
  // 使用异步 stat 避免阻塞事件循环；读取失败时回退为当前时间。
  const [, stats] = await attemptAsync(() => fs.promises.stat(filepath))
  const time = stats && stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats?.atime ?? new Date()

  return formatPostDate(time)
}

export function getCurrentName(filepath: string): string {
  if (isReadme(filepath))
    return normalizeTitle(path.basename(path.dirname(filepath)) || 'Home')

  return normalizeTitle(path.basename(filepath, '.md'))
}

export async function getPermalinkByFilepath(filepath: string, base = '/'): Promise<string> {
  const relative = removeLeadingSlash(ensureLeadingSlash(filepath).replace(ensureLeadingSlash(base), ''))
  const dirs = path.dirname(relative).split('/').map(normalizeTitle)
  const basename = normalizeTitle(path.basename(relative, '.md'))
  if (hasPinyin) {
    const pinyin = await getPinyin()
    return path.join(
      ...dirs.map(dir => slugify(pinyin?.(dir, { toneType: 'none', nonZh: 'consecutive' }) || dir)),
      slugify(pinyin?.(basename, { toneType: 'none', nonZh: 'consecutive' }) || basename),
    )
  }
  return path.join(...dirs.map(slugify), slugify(basename))
}

function slugify(str: string): string {
  return kebabCase(str.trim())
}
