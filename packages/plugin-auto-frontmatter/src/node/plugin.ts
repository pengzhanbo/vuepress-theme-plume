import type { Plugin } from '@vuepress/core'
import { fs } from '@vuepress/utils'
import chokidar from 'chokidar'
import globToRegexp from 'glob-to-regexp'
import grayMatter from 'gray-matter'
import type {
  AutoFrontmatterOptions,
  FormatterArray,
  FormatterObject,
  MarkdownFile,
} from '../shared/index.js'
import { readMarkdown, readMarkdownList } from './readFiles.js'

export const autoFrontmatterPlugin = ({
  glob = '',
  formatter = {},
}: AutoFrontmatterOptions = {}): Plugin => {
  glob = glob ? (Array.isArray(glob) ? glob : [glob]) : []
  glob = ['**/*.{md,MD}', '!.vuepress/', '!node_modules/', ...glob]

  const matterFormatter: FormatterArray = Array.isArray(formatter)
    ? formatter
    : [{ glob: '*', formatter }]

  const globFormatter: FormatterObject =
    matterFormatter.find(({ glob }) => glob === '*')?.formatter || {}

  const otherFormatters = matterFormatter
    .filter(({ glob }) => glob !== '*')
    .map(({ glob, formatter }) => {
      return {
        glob,
        regexp: globToRegexp(glob, {
          globstar: true,
          extended: true,
        }),
        formatter,
      }
    })

  function formatMarkdown(file: MarkdownFile): void {
    const { filepath, relativePath } = file

    const formatter =
      otherFormatters.find(({ regexp }) => regexp.test(relativePath))
        ?.formatter || globFormatter
    const { data, content } = grayMatter(file.content)

    Object.keys(formatter).forEach((key) => {
      const value = formatter[key](data[key], data, file)
      data[key] = value ?? data[key]
    })
    const newContent = grayMatter.stringify({ content }, data)

    fs.writeFileSync(filepath, newContent)
  }

  return {
    name: '@vuepress-plume/vuepress-plugin-auto-frontmatter',
    onInitialized: async (app) => {
      const markdownList = await readMarkdownList(
        app.dir.source(),
        glob as string[]
      )
      markdownList.forEach((file) => formatMarkdown(file))
    },
    onWatched: async (app, watchers) => {
      const watcher = chokidar.watch('**/*.md', {
        cwd: app.dir.source(),
        ignoreInitial: true,
        ignored: /(node_modules|\.vuepress)\//,
      })

      watcher.on('add', (relativePath) => {
        if ((glob as string[]).some((_) => !globToRegexp(_).test(relativePath)))
          return
        formatMarkdown(readMarkdown(app.dir.source(), relativePath))
      })

      watchers.push(watcher)
    },
  }
}
