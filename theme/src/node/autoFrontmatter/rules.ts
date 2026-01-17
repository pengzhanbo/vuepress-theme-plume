import type {
  AutoFrontmatterContext,
  AutoFrontmatterData,
  AutoFrontmatterOptions,
  AutoFrontmatterRule,
  ThemeDocCollection,
} from '../../shared/index.js'
import type { ThemePostCollection } from '../../shared/index.js'
import { hasOwn, toArray } from '@pengzhanbo/utils'
import { ensureEndingSlash, ensureLeadingSlash, removeLeadingSlash } from 'vuepress/shared'
import { path } from 'vuepress/utils'
import { getThemeConfig } from '../loadConfig/index.js'
import { nanoid } from '../utils/index.js'
import {
  EXCLUDE,
  getCurrentName,
  getFileCreateTime,
  getPermalinkByFilepath,
  isReadme,
} from './helper.js'
import { resolveLinkBySidebar } from './resolveLinkBySidebar.js'

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
    data.permalink = path.join(
      locale,
      collection.linkPrefix || collection.link || collection.dir,
      ep === 'filepath'
        ? await getPermalinkByFilepath(context.relativePath, path.join(locale, collection.dir))
        : nanoid(),
      '/',
    )
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
      const file = path.dirname(context.relativePath)
      const link = res[ensureLeadingSlash(ensureEndingSlash(file))] || '/'
      data.permalink = path.join(
        locale,
        collection.linkPrefix,
        link,
        isReadme(context.relativePath)
          ? ''
          : ep === 'filepath'
            ? await getPermalinkByFilepath(
                link === '/' ? context.relativePath : path.basename(context.relativePath),
                link === '/' ? path.join(locale, collection.dir) : '',
              )
            : nanoid(8),
        '/',
      )
    }
    else {
      data.permalink = path.join(
        locale,
        collection.linkPrefix,
        ep === 'filepath'
          ? await getPermalinkByFilepath(context.relativePath, path.join(locale, collection.dir))
          : nanoid(8),
        '/',
      )
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
    data.permalink = path.join(
      locale,
      ep === 'filepath' ? await getPermalinkByFilepath(context.relativePath, locale) : nanoid(8),
      '/',
    )
  }

  data = await transform?.(data, context, locale) ?? data

  return data
}
