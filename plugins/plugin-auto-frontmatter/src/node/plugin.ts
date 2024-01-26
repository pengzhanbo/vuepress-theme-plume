import { fs } from 'vuepress/utils'
import type { Plugin } from 'vuepress/core'
import chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import grayMatter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import type {
  AutoFrontmatterOptions,
  FrontmatterArray,
  FrontmatterObject,
  MarkdownFile,
} from '../shared/index.js'
import { readMarkdown, readMarkdownList } from './readFiles.js'
import { ensureArray, isEmptyObject } from './utils.js'

export function autoFrontmatterPlugin({
  include = ['**/*.{md,MD}'],
  exclude = ['.vuepress/**/*', 'node_modules'],
  frontmatter = {},
}: AutoFrontmatterOptions = {}): Plugin {
  include = ensureArray(include)
  exclude = ensureArray(exclude)

  const globFilter = createFilter(include, exclude, { resolve: false })

  const matterFrontmatter: FrontmatterArray = Array.isArray(frontmatter)
    ? frontmatter
    : [{ include: '*', frontmatter }]

  const globFormatter: FrontmatterObject
    = matterFrontmatter.find(({ include }) => include === '*')?.frontmatter || {}

  const otherFormatters = matterFrontmatter
    .filter(({ include }) => include !== '*')
    .map(({ include, frontmatter }) => {
      return {
        include,
        filter: createFilter(ensureArray(include), [], { resolve: false }),
        frontmatter,
      }
    })

  async function formatMarkdown(file: MarkdownFile): Promise<void> {
    const { filepath, relativePath } = file

    const current = otherFormatters.find(({ filter }) => filter(relativePath))
    const formatter = current?.frontmatter || globFormatter
    const { data, content } = grayMatter(file.content)

    for (const key in formatter) {
      const value = await formatter[key](data[key], file, data)
      data[key] = value ?? data[key]
    }

    try {
      const yaml = isEmptyObject(data)
        ? ''
        : jsonToYaml
          .stringify(data)
          .replace(/\n\s{2}/g, '\n')
          .replace(/"/g, '')
      const newContent = yaml ? `${yaml}---\n${content}` : content

      fs.writeFileSync(filepath, newContent, 'utf-8')
    }
    catch (e) {
      console.error(e)
    }
  }

  return {
    name: '@vuepress-plume/plugin-auto-frontmatter',
    onInitialized: async (app) => {
      const markdownList = await readMarkdownList(app.dir.source(), globFilter)
      for (const file of markdownList)
        await formatMarkdown(file)
    },
    onWatched: async (app, watchers) => {
      const watcher = chokidar.watch('**/*.md', {
        cwd: app.dir.source(),
        ignoreInitial: true,
        ignored: /(node_modules|\.vuepress)\//,
      })

      watcher.on('add', async (relativePath) => {
        if (!globFilter(relativePath))
          return
        await formatMarkdown(readMarkdown(app.dir.source(), relativePath))
      })

      watchers.push(watcher)
    },
  }
}
