import { createRequire } from 'node:module'
import path from 'node:path'
import type {
  AutoFrontmatterOptions,
  FormatterArray,
} from '@vuepress-plume/vuepress-plugin-auto-frontmatter'
import type {
  NotesDataOptions,
  NotesItem,
} from '@vuepress-plume/vuepress-plugin-notes-data'
import type { App } from '@vuepress/core'
import { format } from 'date-fns'
import { customAlphabet } from 'nanoid'
import type { PlumeThemeLocaleOptions } from '../shared/index.js'

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

export default function (
  app: App,
  localeOption: PlumeThemeLocaleOptions
): AutoFrontmatterOptions {
  const sourceDir = app.dir.source()
  const require = createRequire(process.cwd())
  let pkg = {} as any
  try {
    pkg = require(path.join(process.cwd(), './package.json')) || {}
  } catch {}
  const articlePrefix = localeOption.article || '/article/'
  const {
    dir,
    link: notesLink,
    notes: notesList,
  } = localeOption.notes as NotesDataOptions
  const notesDir = dir.replace(/^\//, '')
  const baseFormatter = {
    author(author: string) {
      if (author) return author
      return localeOption.avatar?.name || pkg.author || ''
    },
    createTime(formatTime: string, _: any, { createTime }) {
      if (formatTime) return formatTime
      return format(new Date(createTime), 'yyyy/MM/dd hh:mm:ss')
    },
  }
  const findNote = (filepath: string) => {
    const file = path.relative(sourceDir, filepath)
    return notesList.find((note) =>
      file.startsWith(path.join(notesDir.replace(/^\//, ''), note.dir))
    )
  }

  const getCurrentDirname = (note: NotesItem | undefined, filepath: string) => {
    const dirList =
      (note?.dir || path.dirname(filepath))
        .replace(/^\/|\/$/g, '')
        .split('/') || []
    return dirList.length > 0 ? dirList[dirList.length - 1] : ''
  }
  return {
    include: ['**/*.md'],
    formatter: [
      {
        // note 首页链接
        include: path.join(notesDir, `**/{readme,README,index}.md`),
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
            const note = findNote(filepath)
            const dirname = getCurrentDirname(note, filepath)
            return path.join(notesLink, note?.link || dirname, '/')
          },
        },
      },
      {
        include: path.join(notesDir, '**/*.md'),
        formatter: {
          title(title: string, { filepath }) {
            if (title) return title
            const basename = path.basename(filepath, '.md')
            return basename
          },
          ...baseFormatter,
          permalink(permalink: string, { filepath }) {
            if (permalink) return permalink
            const note = findNote(filepath)
            const dirname = getCurrentDirname(note, filepath)
            return path.join(notesLink, note?.link || dirname, nanoid(), '/')
          },
        },
      },
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
          permalink(permalink: string) {
            if (permalink) return permalink
            return path.join(articlePrefix, nanoid(), '/')
          },
        },
      },
    ] as FormatterArray,
  }
}
