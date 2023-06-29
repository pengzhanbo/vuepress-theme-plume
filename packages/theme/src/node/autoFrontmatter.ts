import { createRequire } from 'node:module'
import path from 'node:path'
import type { App } from '@vuepress/core'
import { resolveLocalePath } from '@vuepress/shared'
import type {
  AutoFrontmatterOptions,
  FormatterArray,
  FormatterObject,
} from '@vuepress-plume/vuepress-plugin-auto-frontmatter'
import type { NotesItem } from '@vuepress-plume/vuepress-plugin-notes-data'
import { format } from 'date-fns'
import { customAlphabet } from 'nanoid'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)
const require = createRequire(process.cwd())
const getPackage = () => {
  let pkg = {} as any
  try {
    pkg = require('package.json') || {}
  } catch {}
  return pkg
}

const normalizePath = (dir: string) => {
  return dir.replace(/\\+/g, '/')
}

export default function autoFrontmatter(
  app: App,
  localeOption: PlumeThemeLocaleOptions
): AutoFrontmatterOptions {
  const sourceDir = app.dir.source()
  const pkg = getPackage()
  const articlePrefix = localeOption.article || '/article/'

  const locales = (app.siteData.locales || {}) as PlumeThemeLocaleOptions
  const localesNotesDirs = Object.keys(locales)
    .map((locale) => {
      const notes = localeOption.locales?.[locale].notes
      if (!notes) return ''
      const dir = notes.dir
      return dir
        ? path.join(locale, dir).replace(/\\+/g, '/').replace(/^\//, '')
        : ''
    })
    .filter(Boolean)

  const baseFormatter: FormatterObject = {
    author(author: string) {
      if (author) return author
      return localeOption.avatar?.name || pkg.author || ''
    },
    createTime(formatTime: string, { createTime }) {
      if (formatTime) return formatTime
      return format(new Date(createTime), 'yyyy/MM/dd hh:mm:ss')
    },
  }

  const resolveLocale = (filepath: string) => {
    const file = path.join('/', path.relative(sourceDir, filepath))
    return resolveLocalePath(localeOption.locales!, file)
  }
  const notesByLocale = (locale: string) => {
    const notes = localeOption.locales![locale].notes || localeOption.notes
    if (notes === false) return undefined
    return notes
  }
  const findNote = (filepath: string) => {
    const file = path.join('/', path.relative(sourceDir, filepath))
    const locale = resolveLocalePath(localeOption.locales!, file)
    const notes = notesByLocale(locale)
    if (!notes) return undefined
    const notesList = notes?.notes || []
    const notesDir = notes?.dir || ''
    return notesList.find((note) =>
      file.startsWith(path.join(locale, notesDir, note.dir))
    )
  }

  const getCurrentDirname = (note: NotesItem | undefined, filepath: string) => {
    const dirList = (note?.dir || path.dirname(filepath))
      .replace(/^\/|\/$/g, '')
      .split('/')
    return dirList.length > 0 ? dirList[dirList.length - 1] : ''
  }
  return {
    include: ['**/*.md'],
    formatter: [
      localesNotesDirs.length
        ? {
            // note 首页链接
            include: localesNotesDirs.map((dir) =>
              path.join(dir, '**/{readme,README,index}.md')
            ),
            formatter: {
              title(title: string, { filepath }) {
                if (title) return title
                const note = findNote(filepath)
                if (note?.text) return note.text
                return getCurrentDirname(note, filepath) || ''
              },
              ...baseFormatter,
              permalink(permalink: string, { filepath }) {
                if (permalink) return permalink
                const locale = resolveLocale(filepath)
                const notes = notesByLocale(locale)
                const note = findNote(filepath)
                return path.join(
                  locale,
                  notes?.link || '',
                  note?.link || getCurrentDirname(note, filepath),
                  '/'
                )
              },
            },
          }
        : '',
      localesNotesDirs.length
        ? {
            include: localesNotesDirs.map((dir) => path.join(dir, '**/**.md')),
            formatter: {
              title(title: string, { filepath }) {
                if (title) return title
                const basename = path.basename(filepath, '.md')
                return basename
              },
              ...baseFormatter,
              permalink(permalink: string, { filepath }) {
                if (permalink) return permalink
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
        formatter: {},
      },
      {
        include: '*',
        formatter: {
          title(title: string, { filepath }) {
            if (title) return title
            const basename = path.basename(filepath, '.md')
            return basename
          },
          ...baseFormatter,
          permalink(permalink: string, { filepath }) {
            if (permalink) return permalink
            const locale = resolveLocale(filepath)
            return normalizePath(
              path.join(locale, articlePrefix, nanoid(), '/')
            )
          },
        },
      },
    ].filter(Boolean) as FormatterArray,
  }
}
