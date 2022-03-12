import * as os from 'os'
import type { App } from '@vuepress/core'
import { fs, path } from '@vuepress/utils'
import { isBoolean, isNumber } from '@vueuse/core'
import * as chokidar from 'chokidar'
import * as dayjs from 'dayjs'
import * as matter from 'gray-matter'
import * as json2yaml from 'json2yaml'
import { customAlphabet } from 'nanoid'
import type { MarkdownFile } from './utils/readFileList'
import { readFileList } from './utils/readFileList'

const prefix = '/post/'

const nanoid = customAlphabet('134567890abcdefghijklmnopqrstuvwxyz', 8)
const matterTask = {
  title: ({ filePath }: MarkdownFile, title: string): string | undefined => {
    if (title) return title
    return path
      .basename(filePath)
      .replace(/^\d+\./, '')
      .replace(path.extname(filePath), '')
  },
  createTime: ({ createTime }: MarkdownFile, formatTime: string) => {
    if (formatTime) return formatTime
    return dayjs(createTime).format('YYYY/MM/DD hh:mm:ss')
  },
  permalink: (_, permalink: string) => {
    if (permalink) return permalink
    return prefix + nanoid() + '  # 文章永久链接，自动生成，可自行配置'
  },
  author: (_, author: string) => {
    if (author) return author
    const pkg = require(path.join(process.cwd(), 'package.json'))
    return pkg.author
  },
  top: (_, top: boolean) => {
    if (isBoolean(top)) return top
    return false
  },
  type: (_, type: string) => {
    if (type) return type
    return ' ' + ' # original: 原创: reprint 转载  可为空不填'
  },
  sort: (_, sort: string) => {
    if (isNumber(parseInt(sort))) return sort
    return 0
  },
}

function formatMarkdown(file: MarkdownFile): string {
  const { data, content } = matter(file.content)
  Object.keys(matterTask).forEach((key) => {
    const value = matterTask[key](file, data[key])
    data[key] = value ?? data[key]
  })
  return (
    json2yaml
      .stringify(data)
      .replace(/\n\s{2}/g, '\n')
      .replace(/"/g, '') +
    '---' +
    os.EOL +
    content
  )
}

export const globFormatFrontmatter = (sourceDir: string): void => {
  const files = readFileList(sourceDir)
  files.forEach((file) => {
    const content = formatMarkdown(file)
    fs.writeFileSync(file.filePath, content, 'utf-8')
  })
}

export const watchNewMarkdown = (app: App, watchers): void => {
  const watcher = chokidar.watch(['**/*.md', '!README.md', '!readme.md'], {
    cwd: app.options.source,
    ignoreInitial: true,
  })
  watcher.on('add', (filePath, stat) => {
    const basename = path.basename(filePath)
    const extname = path.extname(basename)
    const name = basename.replace(extname, '')
    filePath = path.join(app.options.source, filePath)
    if (extname !== '.md' && extname !== '.MD') return
    if (/readme/i.test(name)) return
    stat = stat || fs.statSync(filePath)
    const file: MarkdownFile = {
      filePath,
      content: '',
      createTime:
        stat.birthtime.getFullYear() !== 1970 ? stat.birthtime : stat.atime,
    }
    const content = formatMarkdown(file)
    fs.writeFileSync(filePath, content, 'utf-8')
  })
  watchers.push(watcher)
}
