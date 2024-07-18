import { fs } from 'vuepress/utils'
import chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import grayMatter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import { isArray, isEmptyObject, promiseParallel, toArray } from '@pengzhanbo/utils'
import type { App } from 'vuepress'
import type {
  AutoFrontmatter,
  AutoFrontmatterArray,
  AutoFrontmatterMarkdownFile,
  AutoFrontmatterObject,
  PlumeThemeLocaleOptions,
} from '../../shared/index.js'
import { readMarkdown, readMarkdownList } from './readFile.js'
import { resolveOptions } from './resolveOptions.js'

export interface Generate {
  globFilter: (id?: string) => boolean
  global: AutoFrontmatterObject
  rules: {
    include: string | string[]
    filter: (id?: string) => boolean
    frontmatter: AutoFrontmatterObject
  }[]
}

let generate: Generate | null = null

export function initAutoFrontmatter(
  localeOptions: PlumeThemeLocaleOptions,
  autoFrontmatter: AutoFrontmatter = {},
) {
  const { include, exclude, frontmatter = {} } = resolveOptions(localeOptions, autoFrontmatter)

  const globFilter = createFilter(include, exclude, { resolve: false })

  const userConfig: AutoFrontmatterArray = isArray(frontmatter)
    ? frontmatter
    : [{ include: '*', frontmatter }]

  const globalConfig: AutoFrontmatterObject
    = userConfig.find(({ include }) => include === '*')?.frontmatter || {}

  const rules = userConfig
    .filter(({ include }) => include !== '*')
    .map(({ include, frontmatter }) => {
      return {
        include,
        filter: createFilter(toArray(include), undefined, { resolve: false }),
        frontmatter,
      }
    })

  generate = {
    globFilter,
    global: globalConfig,
    rules,
  }
}

export async function generateAFrontmatter(app: App) {
  if (!generate)
    return
  const markdownList = await readMarkdownList(app.dir.source(), generate.globFilter)
  await promiseParallel(
    markdownList.map(file => () => generator(file)),
    64,
  )
}

export async function watchAutoFrontmatter(app: App, watchers: any[], enable?: () => boolean) {
  if (!generate)
    return

  const watcher = chokidar.watch('**/*.md', {
    cwd: app.dir.source(),
    ignoreInitial: true,
    ignored: /(node_modules|\.vuepress)\//,
  })

  watcher.on('add', async (relativePath) => {
    const enabled = enable ? enable() : true
    if (!generate!.globFilter(relativePath) || !enabled)
      return
    const file = await readMarkdown(app.dir.source(), relativePath)
    await generator(file)
  })

  watchers.push(watcher)
}

async function generator(file: AutoFrontmatterMarkdownFile): Promise<void> {
  if (!generate)
    return
  const { filepath, relativePath } = file

  const current = generate.rules.find(({ filter }) => filter(relativePath))
  const formatter = current?.frontmatter || generate.global
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

    await fs.promises.writeFile(filepath, newContent, 'utf-8')
  }
  catch (e) {
    console.error(e)
  }
}
