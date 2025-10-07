import type { AutoFrontmatterContext, AutoFrontmatterData, AutoFrontmatterOptions, AutoFrontmatterRule, ThemeDocCollection, ThemeSidebarItem } from '../../shared/index.js'
import type { ThemePostCollection } from '../../shared/index.js'
import { hasOwn, toArray } from '@pengzhanbo/utils'
import dayjs from 'dayjs'
import { ensureLeadingSlash, removeLeadingSlash } from 'vuepress/shared'
import { fs, path } from 'vuepress/utils'
import { getThemeConfig } from '../loadConfig/index.js'
import { nanoid } from '../utils/index.js'

const EXCLUDE = ['!**/.vuepress/', '!**/node_modules/']

const rules: AutoFrontmatterRule[] = []

export function getRules(): AutoFrontmatterRule[] {
  return rules
}

export function genAutoFrontmatterRules(): void {
  const options = getThemeConfig()
  const remainExclude: string[] = [...EXCLUDE]

  rules.length = 0

  const autoFrontmatter = options.autoFrontmatter ?? {}

  for (const [locale, { collections }] of Object.entries(options.locales || {})) {
    if (!collections?.length)
      continue

    for (const collection of collections) {
      const source = removeLeadingSlash(path.join(locale, collection.dir, '**/*.md'))
      // 无论 集合是否启用 autoFrontmatter，
      // 在最后的对剩余文件的 auto frontmatter 都需要排除当前集合的文件
      remainExclude.push(source)

      if ((collection.autoFrontmatter ?? autoFrontmatter) === false)
        continue

      if (collection.type === 'post') {
        rules.push({
          filter: [
            source,
            ...toArray(collection.include),
            ...EXCLUDE,
            ...toArray(collection.exclude).map(s => `!${s}`),
          ],
          handle: (data, context) => generateWithPost(data, context, collection, autoFrontmatter, locale),
        })
      }
      else {
        rules.push({
          filter: [source, ...EXCLUDE],
          handle: (data, context) => generateWithDoc(data, context, collection, autoFrontmatter, locale),
        })
      }
    }
    if (locale !== '/') {
      const source = removeLeadingSlash(path.join(locale, '**/*.md'))
      // locale fallback
      rules.push({
        filter: [
          source,
          ...remainExclude.map(s => `!${s}`),
        ],
        handle: (data, context) => generateWithRemain(data, context, autoFrontmatter, locale),
      })
      remainExclude.push(source)
    }
  }
  // root fallback
  rules.push({
    filter: [
      '**/*.md',
      ...remainExclude.map(s => `!${s}`),
    ],
    handle: (data, context) => generateWithRemain(data, context, autoFrontmatter, '/'),
  })
}

async function generateWithPost(
  data: AutoFrontmatterData,
  context: AutoFrontmatterContext,
  collection: ThemePostCollection,
  fm: AutoFrontmatterOptions | false,
  locale: string,
): Promise<AutoFrontmatterData> {
  if ((collection.autoFrontmatter ?? fm) === false)
    return data

  const { title: et = true, createTime: ec = true, permalink: ep = true } = { ...fm, ...collection.autoFrontmatter }
  const transform = (collection.autoFrontmatter || {}).transform
  const isRoot = context.filepath.endsWith(path.join(locale, collection.dir, 'README.md'))

  if (et && !hasOwn(data, 'title')) {
    data.title = isRoot ? collection.title : getCurrentName(context.relativePath)
  }

  if (ec && !hasOwn(data, 'createTime')) {
    data.createTime = getFileCreateTime(context.filepath)
  }

  if (ep && !hasOwn(data, 'permalink')) {
    data.permalink = path.join(locale, collection.linkPrefix || collection.link || collection.dir, nanoid(), '/')
  }

  data = await transform?.(data, context, locale) ?? data

  return data
}

async function generateWithDoc(
  data: AutoFrontmatterData,
  context: AutoFrontmatterContext,
  collection: ThemeDocCollection,
  fm: AutoFrontmatterOptions | false,
  locale: string,
): Promise<AutoFrontmatterData> {
  if ((collection.autoFrontmatter ?? fm) === false)
    return data

  const { title: et = true, createTime: ec = true, permalink: ep = true } = { ...fm, ...collection.autoFrontmatter }
  const transform = (collection.autoFrontmatter || {}).transform
  const isRoot = context.filepath.endsWith(path.join(locale, collection.dir, 'README.md'))

  if (et && !hasOwn(data, 'title')) {
    data.title = isRoot ? collection.title : getCurrentName(context.relativePath)
  }

  if (ec && !hasOwn(data, 'createTime')) {
    data.createTime = getFileCreateTime(context.filepath)
  }

  if (ep && !hasOwn(data, 'permalink')) {
    if (isRoot) {
      data.permalink = path.join(locale, collection.linkPrefix, '/')
    }
    else if (collection.sidebar && collection.sidebar !== 'auto') {
      const res = resolveLinkBySidebar(collection.sidebar, ensureLeadingSlash(collection.dir))
      const file = ensureLeadingSlash(context.relativePath)
      const link = res[file] || res[path.dirname(file)] || ''
      data.permalink = path.join(locale, collection.linkPrefix, link, isReadme(context.relativePath) ? '' : nanoid(8), '/')
    }
    else {
      data.permalink = path.join(locale, collection.linkPrefix, nanoid(8), '/')
    }
  }

  data = await transform?.(data, context, locale) ?? data

  return data
}

async function generateWithRemain(
  data: AutoFrontmatterData,
  context: AutoFrontmatterContext,
  fm: AutoFrontmatterOptions | false,
  locale: string,
): Promise<AutoFrontmatterData> {
  if (fm === false)
    return data

  const { title: et = true, createTime: ec = true, permalink: ep = true, transform } = fm
  const isRoot = context.filepath.endsWith(path.join(locale, 'README.md'))

  if (isRoot) {
    data.pageLayout = 'home'
  }

  if (et && !hasOwn(data, 'title')) {
    data.title = isRoot ? 'Home' : getCurrentName(context.relativePath)
  }

  if (ec && !hasOwn(data, 'createTime') && !isRoot) {
    data.createTime = getFileCreateTime(context.filepath)
  }

  if (ep && !hasOwn(data, 'permalink') && !isRoot) {
    data.permalink = path.join(locale, nanoid(8), '/')
  }

  data = await transform?.(data, context, locale) ?? data

  return data
}

function isReadme(filepath: string): boolean {
  return filepath.endsWith('README.md') || filepath.endsWith('index.md') || filepath.endsWith('readme.md')
}

function normalizeTitle(title: string): string {
  return title.replace(/^\d+\./, '').trim()
}

function getFileCreateTime(filepath: string): string {
  const stats = fs.statSync(filepath)
  const time = stats.birthtime.getFullYear() !== 1970 ? stats.birthtime : stats.atime
  return dayjs(new Date(time)).format('YYYY/MM/DD HH:mm:ss')
}

function getCurrentName(filepath: string): string {
  if (isReadme(filepath))
    return normalizeTitle(path.dirname(filepath).slice(-1).split('/').pop() || 'Home')

  return normalizeTitle(path.basename(filepath, '.md'))
}

export function resolveLinkBySidebar(
  sidebar: 'auto' | (string | ThemeSidebarItem)[],
  _prefix: string,
): Record<string, string> {
  const res: Record<string, string> = {}

  if (sidebar === 'auto') {
    return res
  }

  for (const item of sidebar) {
    if (typeof item !== 'string') {
      const { prefix, dir = '', link = '/', items, text = '' } = item
      getSidebarLink(items, link, text, path.join(_prefix, prefix || dir), res)
    }
  }
  return res
}

function getSidebarLink(items: 'auto' | (string | ThemeSidebarItem)[] | undefined, link: string, text: string, dir = '', res: Record<string, string> = {}) {
  if (items === 'auto')
    return

  if (!items) {
    res[path.join(dir, `${text}.md`)] = link
    return
  }

  for (const item of items) {
    if (typeof item === 'string') {
      if (!link)
        continue
      if (item) {
        res[path.join(dir, `${item}.md`)] = link
      }
      else {
        res[path.join(dir, 'README.md')] = link
        res[path.join(dir, 'index.md')] = link
        res[path.join(dir, 'readme.md')] = link
      }
      res[dir] = link
    }
    else {
      const { prefix, dir: subDir = '', link: subLink = '/', items: subItems, text: subText = '' } = item
      getSidebarLink(
        subItems,
        path.join(link, subLink),
        subText,
        path.join(prefix?.[0] === '/' ? prefix : `/${dir}/${prefix}`, subDir),
        res,
      )
    }
  }
}
