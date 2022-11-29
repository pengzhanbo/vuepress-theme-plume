import { createRequire } from 'module'
import type { App } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import chokidar from 'chokidar'
import { format } from 'date-fns'
import matter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import { customAlphabet } from 'nanoid'
import type {
  PlumeThemeLocaleOptions,
  PlumeThemeNotesItem,
  PlumeThemeNotesOptions,
} from '../shared/index.js'
import type { MarkdownFile } from './utils/index.js'
import { readFile, readFileList } from './utils/index.js'

const require = createRequire(import.meta.url)

export interface GenerateFrontmatter {
  formatFrontmatter: () => void
  watchNewMarkDown: (app: App, watchers: unknown) => void
}

const nanoid = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 8)

const isReadme = function (filepath: string): boolean {
  return /((readme)|(index))\.md$/i.test(filepath)
}

export const generateFrontmatter = (
  sourceDir: string,
  localeOption: PlumeThemeLocaleOptions
): GenerateFrontmatter => {
  const { article, notes } = localeOption
  const {
    notes: noteList,
    link: notesLink,
    dir: notesDir,
  } = notes as PlumeThemeNotesOptions
  const matterTask: Record<string, any> = {
    title: ({ filepath }: MarkdownFile, title: string): string => {
      if (title) return title
      const file = path.relative(sourceDir, filepath)
      let currentNote: PlumeThemeNotesItem | undefined
      if (
        notesDir &&
        file.startsWith(notesDir.replace(/^\//, '')) &&
        isReadme(filepath) &&
        (currentNote = noteList.find((note) =>
          file.startsWith(path.join(notesDir.replace(/^\//, ''), note.dir))
        ))
      ) {
        return currentNote.text || currentNote.dir
      }
      const basename = path.basename(filepath)
      if (isReadme(basename)) {
        return path.dirname(filepath).split('/').slice(-1)[0]
      }
      return basename.replace(/^\d+\./, '').replace(path.extname(filepath), '')
    },
    createTime: ({ createTime }: MarkdownFile, formatTime: string): string => {
      if (formatTime) return formatTime
      return format(new Date(createTime), 'yyyy/MM/dd hh:mm:ss')
    },
    author: (_: any, author: string): string => {
      if (author) return author
      const pkg = require(path.join(process.cwd(), 'package.json'))
      return pkg.author
    },
    // 自动生成永久链接
    permalink: ({ filepath }: MarkdownFile, permalink: string): string => {
      const file = path.relative(sourceDir, filepath)
      if (permalink) {
        if (notes && notesDir && file.startsWith(notesDir.replace(/^\//, ''))) {
          return permalink
        } else {
          if (
            article &&
            permalink.startsWith('/' + article.replace(/^\//, ''))
          ) {
            return permalink
          } else {
            const per = permalink.split('/')
            return path.join(article, per[per.length - 1])
          }
        }
      }
      let prefix = ''
      if (notes) {
        // 表示是以笔记开头的
        if (notesDir && file.startsWith(notesDir.replace(/^\//, ''))) {
          prefix = notesLink || ''
          const currentNote = noteList.find((note) =>
            file.startsWith(path.join(notesDir.replace(/^\//, ''), note.dir))
          )
          currentNote && (prefix = path.join(prefix, currentNote.link))
        } else {
          prefix = article as string
        }
      } else {
        prefix = article as string
      }
      return path.join(prefix, isReadme(filepath) ? '' : nanoid(), '/')
    },
  }

  const formatMarkdown = (file: MarkdownFile): string => {
    const { data, content } = matter(file.content)
    Object.keys(matterTask).forEach((key) => {
      const value = matterTask[key](file, data[key])
      data[key] = value ?? data[key]
    })
    const yaml = jsonToYaml
      .stringify(data)
      .replace(/\n\s{2}/g, '\n')
      .replace(/"/g, '')
    return `${yaml}---\n${content}`
  }

  const formatFrontmatter = (): void => {
    const files = readFileList(sourceDir)
    files.forEach((file) => {
      const relativePath = path.relative(sourceDir, file.filepath)
      if (isReadme(relativePath)) return
      fs.writeFileSync(file.filepath, formatMarkdown(file), 'utf-8')
    })
  }

  const watchNewMarkDown = (app: App, watchers: any): void => {
    const watcher = chokidar.watch('**/*.md', {
      ignored: /node_modules/,
      cwd: app.options.source,
      ignoreInitial: true,
    })
    watcher.on('add', (file, stat) => {
      const filepath = path.join(app.options.source, file)
      stat = stat || fs.statSync(filepath)
      const newFile = readFile(filepath, stat)
      const content = formatMarkdown(newFile)
      fs.writeFileSync(filepath, content, 'utf-8')
    })
    watchers.push(watcher)
  }

  return { formatFrontmatter, watchNewMarkDown }
}
