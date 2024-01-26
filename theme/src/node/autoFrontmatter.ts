import { path } from 'vuepress/utils'
import type { App } from 'vuepress/core'
import { resolveLocalePath } from 'vuepress/shared'
import type {
  AutoFrontmatterOptions,
  FrontmatterArray,
  FrontmatterObject,
} from '@vuepress-plume/plugin-auto-frontmatter'
import { format } from 'date-fns'
import { uniq } from '@pengzhanbo/utils'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemePluginOptions,
} from '../shared/index.js'
import { getCurrentDirname, getPackage, nanoid, pathJoin } from './utils.js'
import { resolveNotesList } from './resolveNotesList.js'
import { resolveLocaleOptions } from './resolveLocaleOptions.js'

export default function autoFrontmatter(
  app: App,
  options: PlumeThemePluginOptions,
  localeOption: PlumeThemeLocaleOptions,
): AutoFrontmatterOptions {
  const sourceDir = app.dir.source()
  const pkg = getPackage()
  const { locales = {}, article: articlePrefix = '/article/' } = localeOption
  const { frontmatter } = options
  const avatar = resolveLocaleOptions(localeOption, 'avatar')
  const notesList = resolveNotesList(localeOption)
  const localesNotesDirs = notesList
    .map(notes => notes.dir?.replace(/^\//, ''))
    .filter(Boolean)

  const baseFrontmatter: FrontmatterObject = {
    author(author: string, _, data: any) {
      if (author)
        return author
      if (data.friends)
        return
      return avatar?.name || pkg.author || ''
    },
    createTime(formatTime: string, { createTime }, data: any) {
      if (formatTime)
        return formatTime
      if (data.friends)
        return
      return format(new Date(createTime), 'yyyy/MM/dd HH:mm:ss')
    },
  }

  const resolveLocale = (filepath: string) => {
    const file = pathJoin('/', path.relative(sourceDir, filepath))

    return resolveLocalePath(localeOption.locales!, file)
  }
  const notesByLocale = (locale: string) => {
    const notes = resolveLocaleOptions(localeOption, 'notes', locale)
    if (notes === false)
      return undefined
    return notes
  }

  const findNote = (filepath: string) => {
    const file = pathJoin('/', path.relative(sourceDir, filepath))
    const locale = resolveLocalePath(locales, file)
    const notes = notesByLocale(locale)
    if (!notes)
      return undefined
    const notesList = notes?.notes || []
    const notesDir = notes?.dir || ''
    return notesList.find(note =>
      file.startsWith(path.join(locale, notesDir, note.dir)),
    )
  }

  return {
    include: frontmatter?.include ?? ['**/*.md'],
    exclude: uniq(['.vuepress/**/*', 'node_modules', ...(frontmatter?.exclude ?? [])]),

    frontmatter: [
      localesNotesDirs.length
        ? {
            // note 首页链接
            include: localesNotesDirs.map(dir => pathJoin(dir, '**/{readme,README,index}.md')),
            frontmatter: {
              title(title: string, { filepath }) {
                if (title)
                  return title
                const note = findNote(filepath)
                if (note?.text)
                  return note.text
                return getCurrentDirname(note?.dir, filepath) || ''
              },
              ...baseFrontmatter,
              permalink(permalink: string, { filepath }, data: any) {
                if (permalink)
                  return permalink
                if (data.friends)
                  return
                const locale = resolveLocale(filepath)
                const notes = notesByLocale(locale)
                const note = findNote(filepath)
                return pathJoin(
                  locale,
                  notes?.link || '',
                  note?.link || getCurrentDirname(note?.dir, filepath),
                  '/',
                )
              },
            },
          }
        : '',
      localesNotesDirs.length
        ? {
            include: localesNotesDirs.map(dir => pathJoin(dir, '**/**.md')),
            frontmatter: {
              title(title: string, { filepath }) {
                if (title)
                  return title
                const basename = path.basename(filepath, '.md')
                return basename
              },
              ...baseFrontmatter,
              permalink(permalink: string, { filepath }, data: any) {
                if (permalink)
                  return permalink
                if (data.friends)
                  return
                const locale = resolveLocale(filepath)
                const note = findNote(filepath)
                const notes = notesByLocale(locale)
                return pathJoin(
                  locale,
                  notes?.link || '',
                  note?.link || getCurrentDirname(note?.dir, filepath),
                  nanoid(),
                  '/',
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
            if (title)
              return title
            const basename = path.basename(filepath, '.md')
            return basename
          },
          ...baseFrontmatter,
          permalink(permalink: string, { filepath }) {
            if (permalink)
              return permalink
            const locale = resolveLocale(filepath)
            const prefix = resolveLocaleOptions(localeOption, 'article', locale, false)
            const args: string[] = []
            prefix
              ? args.push(prefix)
              : args.push(locale, articlePrefix)

            return pathJoin(...args, nanoid(), '/')
          },
        },
      },
    ].filter(Boolean) as FrontmatterArray,
  }
}
