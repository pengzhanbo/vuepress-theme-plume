import fs from 'node:fs'
import type { Plugin } from '@vuepress/core'
import chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import grayMatter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import type {
  AutoFrontmatterOptions,
  FormatterArray,
  FormatterObject,
  MarkdownFile,
} from '../shared/index.js'
import { readMarkdown, readMarkdownList } from './readFiles.js'
import { ensureArray } from './utils.js'

export const autoFrontmatterPlugin = ({
  include = ['**/*.{md,MD}'],
  exclude = ['.vuepress/**/*', 'node_modules'],
  formatter = {},
}: AutoFrontmatterOptions = {}): Plugin => {
  include = ensureArray(include)
  exclude = ensureArray(exclude)

  const globFilter = createFilter(include, exclude, { resolve: false })

  const matterFormatter: FormatterArray = Array.isArray(formatter)
    ? formatter
    : [{ include: '*', formatter }]

  const globFormatter: FormatterObject =
    matterFormatter.find(({ include }) => include === '*')?.formatter || {}

  const otherFormatters = matterFormatter
    .filter(({ include }) => include !== '*')
    .map(({ include, formatter }) => {
      return {
        include,
        filter: createFilter(ensureArray(include)),
        formatter,
      }
    })

  function formatMarkdown(file: MarkdownFile): void {
    const { filepath, relativePath } = file

    const formatter =
      otherFormatters.find(({ filter }) => filter(relativePath))?.formatter ||
      globFormatter
    const { data, content } = grayMatter(file.content)

    Object.keys(formatter).forEach((key) => {
      const value = formatter[key](data[key], data, file)
      data[key] = value ?? data[key]
    })
    const yaml = jsonToYaml
      .stringify(data)
      .replace(/\n\s{2}/g, '\n')
      .replace(/"/g, '')
    const newContent = `${yaml}---\n${content}`

    fs.writeFileSync(filepath, newContent, 'utf-8')
  }

  return {
    name: '@vuepress-plume/vuepress-plugin-auto-frontmatter',
    onInitialized: async (app) => {
      const markdownList = await readMarkdownList(app.dir.source(), globFilter)
      markdownList.forEach((file) => formatMarkdown(file))
    },
    onWatched: async (app, watchers) => {
      const watcher = chokidar.watch('**/*.md', {
        cwd: app.dir.source(),
        ignoreInitial: true,
        ignored: /(node_modules|\.vuepress)\//,
      })

      watcher.on('add', (relativePath) => {
        if (!globFilter(relativePath)) return
        formatMarkdown(readMarkdown(app.dir.source(), relativePath))
      })

      watchers.push(watcher)
    },
  }
}
