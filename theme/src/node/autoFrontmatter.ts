import fs from 'node:fs'
import path from 'node:path'
import type { App } from '@vuepress/core'
import { resolveLocalePath } from '@vuepress/shared'
import type {
  AutoFrontmatterOptions,
  FrontmatterArray,
  FrontmatterObject,
} from '@vuepress-plume/plugin-auto-frontmatter'
import type { NotesItem } from '@vuepress-plume/plugin-notes-data'
import { format } from 'date-fns'
import { customAlphabet } from 'nanoid'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions
} from '../shared/index.js'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
const getPackage = () => {
  let pkg = {} as any
  try {
    const content = fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf-8')
    pkg = JSON.parse(content)
  } catch {}
  return pkg
}

const normalizePath = (dir: string) => {
  return dir.replace(/\\+/g, '/')
}

export default function autoFrontmatter(
  app: App,
  options: PlumeThemePluginOptions,
  localeOption: PlumeThemeLocaleOptions
): AutoFrontmatterOptions {
  const sourceDir = app.dir.source()
  const pkg = getPackage()
  const articlePrefix = localeOption.article || '/article/'

  const locales = (app.siteData.locales || {}) as PlumeThemeLocaleOptions
  const localesNotesDirs = Object.keys(locales)
    .map((locale) => {
      // fixed: #15
      const notes = localeOption.locales?.[locale]?.notes
      if (!notes) return ''
      const dir = notes.dir
      return dir ? normalizePath(path.join(locale, dir)).replace(/^\//, '') : ''
    })
    .filter(Boolean)

  const baseFrontmatter: FrontmatterObject = {
    author(author: string, _, data: any) {
      if (author) return author
      if (data.friends) return
      return localeOption.avatar?.name || pkg.author || ''
    },
    createTime(formatTime: string, { createTime }, data: any) {
      if (formatTime) return formatTime
      if (data.friends) return
      return format(new Date(createTime), 'yyyy/MM/dd HH:mm:ss')
    },
  }

  const resolveLocale = (filepath: string) => {
    const file = normalizePath(
      path.join('/', path.relative(sourceDir, filepath))
    )
    return resolveLocalePath(localeOption.locales!, file)
  }
  const notesByLocale = (locale: string) => {
    const notes = localeOption.locales![locale]?.notes || localeOption.notes
    if (notes === false) return undefined
    return notes
  }
  const findNote = (filepath: string) => {
    const file = path.join('/', path.relative(sourceDir, filepath))
    const locale = resolveLocalePath(localeOption.locales!, normalizePath(file))
    const notes = notesByLocale(locale)
    if (!notes) return undefined
    const notesList = notes?.notes || []
    const notesDir = notes?.dir || ''
    return notesList.find((note) =>
      file.startsWith(path.join(locale, notesDir, note.dir))
    )
  }

  const getCurrentDirname = (note: NotesItem | undefined, filepath: string) => {
    const dirList = normalizePath(note?.dir || path.dirname(filepath))
      .replace(/^\/|\/$/g, '')
      .split('/')
    return dirList.length > 0 ? dirList[dirList.length - 1] : ''
  }
  return {
    include: options.frontmatter?.include ?? ['**/*.md'],
    exclude: options.frontmatter?.exclude ?? ['.vuepress/**/*', 'node_modules'],
    frontmatter: options.frontmatter?.frontmatter ?? [
      localesNotesDirs.length
        ? {
            // note 首页链接
            include: localesNotesDirs.map((dir) =>
              normalizePath(path.join(dir, '**/{readme,README,index}.md'))
            ),
            frontmatter: {
              title(title: string, { filepath }) {
                if (title) return title
                const note = findNote(filepath)
                if (note?.text) return note.text
                return getCurrentDirname(note, filepath) || ''
              },
              ...baseFrontmatter,
              permalink(permalink: string, { filepath }, data: any) {
                if (permalink) return permalink
                if (data.friends) return
                const locale = resolveLocale(filepath)
                const notes = notesByLocale(locale)
                const note = findNote(filepath)
                return normalizePath(
                  path.join(
                    locale,
                    notes?.link || '',
                    note?.link || getCurrentDirname(note, filepath),
                    '/'
                  )
                )
              },
            },
          }
        : '',
      localesNotesDirs.length
        ? {
            include: localesNotesDirs.map((dir) =>
              normalizePath(path.join(dir, '**/**.md'))
            ),
            frontmatter: {
              title(title: string, { filepath }) {
                if (title) return title
                const basename = path.basename(filepath, '.md')
                return basename
              },
              ...baseFrontmatter,
              permalink(permalink: string, { filepath }, data: any) {
                if (permalink) return permalink
                if (data.friends) return
                const locale = resolveLocale(filepath)
                const note = findNote(filepath)
                const notes = notesByLocale(locale)
                return normalizePath(
                  path.join(
                    locale,
                    notes?.link || '',
                    note?.link || getCurrentDirname(note, filepath),
                    nanoid(),
                    '/'
                  )
                )
              },
            },
          }
        : '',
      {
        include: '**/{readme,README,index}.md',
        frontmatter: {},
      },
      {
        include: '*',
        frontmatter: {
          title(title: string, { filepath }) {
            if (title) return title
            const basename = path.basename(filepath, '.md')
            return basename
          },
          ...baseFrontmatter,
          permalink(permalink: string, { filepath }) {
            if (permalink) return permalink
            const locale = resolveLocale(filepath)
            return normalizePath(
              path.join(locale, articlePrefix, nanoid(), '/')
            )
          },
        },
      },
    ].filter(Boolean) as FrontmatterArray,
  }
}
