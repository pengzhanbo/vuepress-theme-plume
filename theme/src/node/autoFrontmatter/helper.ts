import { attemptAsync, kebabCase } from '@pengzhanbo/utils'
import dayjs from 'dayjs'
import { ensureLeadingSlash, removeLeadingSlash } from 'vuepress/shared'
import { fs, path } from 'vuepress/utils'
import { getPinyin, hasPinyin } from '../utils/index.js'

export const EXCLUDE = ['!**/.vuepress/', '!**/node_modules/']

const NUMBER_RE = /^\d+\./

export function isReadme(filepath: string): boolean {
  return filepath.endsWith('README.md') || filepath.endsWith('index.md') || filepath.endsWith('readme.md')
}

export function normalizeTitle(title: string): string {
  return title.replace(NUMBER_RE, '').trim()
}

export async function getFileCreateTime(filepath: string): Promise<string> {
  // 使用异步 stat 避免阻塞事件循环；读取失败时回退为当前时间。
  const [, stats] = await attemptAsync(() => fs.promises.stat(filepath))
  const time = stats && stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats?.atime ?? new Date()

  return dayjs(new Date(time)).format('YYYY/MM/DD HH:mm:ss')
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
