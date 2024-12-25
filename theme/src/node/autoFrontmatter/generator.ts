import type { App } from 'vuepress'
import type {
  AutoFrontmatterArray,
  AutoFrontmatterMarkdownFile,
  AutoFrontmatterObject,
  AutoFrontmatterOptions,
  PlumeThemeLocaleOptions,
} from '../../shared/index.js'
import { isArray, isEmptyObject, promiseParallel, toArray } from '@pengzhanbo/utils'
import chokidar from 'chokidar'
import { createFilter } from 'create-filter'
import grayMatter from 'gray-matter'
import jsonToYaml from 'json2yaml'
import { colors, fs, hash, path } from 'vuepress/utils'
import { getThemeConfig } from '../loadConfig/index.js'
import { perfLog, perfMark } from '../utils/index.js'
import { readMarkdown, readMarkdownList } from './readFile.js'
import { resolveOptions } from './resolveOptions.js'

const CACHE_FILE = 'markdown/auto-frontmatter.json'

export interface Generate {
  globFilter: (id?: string) => boolean
  global: AutoFrontmatterObject
  rules: {
    include: string | string[]
    filter: (id?: string) => boolean
    frontmatter: AutoFrontmatterObject
  }[]
  cache: Record<string, string>
  checkCache: (id: string) => boolean
  updateCache: (app: App) => Promise<void>
}

let generate: Generate | null = null

export function initAutoFrontmatter(
  localeOptions: PlumeThemeLocaleOptions,
  autoFrontmatter: AutoFrontmatterOptions = {},
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

  const cache: Record<string, string> = {}

  function checkCache(filepath: string): boolean {
    const stats = fs.statSync(filepath)

    if (cache[filepath] && cache[filepath] === stats.mtimeMs.toString())
      return false
    cache[filepath] = stats.mtimeMs.toString()
    return true
  }

  async function updateCache(app: App): Promise<void> {
    if (!isEmptyObject(cache)) {
      await fs.mkdir(path.dirname(app.dir.cache(CACHE_FILE)), { recursive: true })
      await fs.writeFile(app.dir.cache(CACHE_FILE), JSON.stringify(cache), 'utf-8')
    }
  }

  generate = {
    globFilter,
    global: globalConfig,
    rules,
    cache,
    checkCache,
    updateCache,
  }
}

export async function generateAutoFrontmatter(app: App) {
  perfMark('generate:frontmatter')
  if (!generate)
    return

  const cachePath = app.dir.cache(CACHE_FILE)
  if (fs.existsSync(cachePath)) {
    try {
      generate.cache = JSON.parse(await fs.readFile(cachePath, 'utf-8'))
    }
    catch {
      generate.cache = {}
    }
  }
  const markdownList = await readMarkdownList(app, generate)
  await promiseParallel(
    markdownList.map(file => () => generator(file)),
    64,
  )

  await generate.updateCache(app)

  perfLog('generate:frontmatter', app.env.isDebug)
}

export async function watchAutoFrontmatter(app: App, watchers: any[]) {
  if (!generate)
    return

  const watcher = chokidar.watch('**/*.md', {
    cwd: app.dir.source(),
    ignoreInitial: true,
    ignored: /(node_modules|\.vuepress)\//,
  })

  watcher.on('add', async (relativePath) => {
    const enabled = getThemeConfig().autoFrontmatter !== false
    if (!generate!.globFilter(relativePath) || !enabled)
      return
    const file = await readMarkdown(app.dir.source(), relativePath)
    await generator(file)
  })

  watcher.on('change', async (relativePath) => {
    const enabled = getThemeConfig().autoFrontmatter !== false
    if (!generate!.globFilter(relativePath) || !enabled)
      return
    if (generate!.checkCache(path.join(app.dir.source(), relativePath)))
      await generate!.updateCache(app)
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

  const beforeHash = hash(data)

  for (const key in formatter) {
    const value = (await formatter[key](data[key], file, data)) ?? data[key]
    if (typeof value !== 'undefined')
      data[key] = value
    else
      delete data[key]
  }

  if (beforeHash === hash(data))
    return

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
    generate.checkCache(filepath)
  }
  catch (e) {
    console.error(
      colors.red('[vuepress-theme-plume:auto-frontmatter] '),
      `error in: ${colors.cyan(relativePath)}\n`,
      e,
    )
  }
}
