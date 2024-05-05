import { colors, fs, logger } from 'vuepress/utils'
import type { Plugin } from 'vuepress/core'
import chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import grayMatter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import { promiseParallel } from '@pengzhanbo/utils'
import type {
  AutoFrontmatterOptions,
  FrontmatterArray,
  FrontmatterObject,
  MarkdownFile,
} from '../shared/index.js'
import { readMarkdown, readMarkdownList } from './readFiles.js'
import { ensureArray, isEmptyObject } from './utils.js'

const PLUGIN_NAME = '@vuepress-plume/plugin-auto-frontmatter'

export function autoFrontmatterPlugin({
  include = ['**/*.md'],
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
          .replace(/\s+\n/g, '\n')
      const newContent = yaml ? `${yaml}---\n${content}` : content

      fs.writeFileSync(filepath, newContent, 'utf-8')
    }
    catch (e) {
      console.error(e)
    }
  }

  return {
    name: PLUGIN_NAME,
    onInitialized: async (app) => {
      const start = performance.now()
      const markdownList = await readMarkdownList(app.dir.source(), globFilter)
      await promiseParallel(
        markdownList.map(file => () => formatMarkdown(file)),
        64,
      )
      if (app.env.isDebug)
        logger.info(`\n[${colors.green(PLUGIN_NAME)}] Init time spent: ${(performance.now() - start).toFixed(2)}ms`)
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
