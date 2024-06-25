/**
 * 针对主题使用了 shiki + twoslash， 以及各种各样的对 markdown 的扩展，
 * 导致了 markdown render 的速度变得越来越慢，如果每次启动都全量编译，那么时间开销会非常夸张。
 * 因此，对 markdown render 包装一层 缓存，通过 content hash 对比内容是否有更新，
 * 没有更新的直接应用缓存从而跳过编译过程，加快启动速度。
 *
 * 此功能计划做成独立的插件，但还不确定是放在 vuepress/ecosystem 还是在 主题插件内，
 * 也有可能到 vuepress/core 仓库中进行更深度的优化。
 * 因此，先在本主题中进行 实验性验证。
 *
 * 使用此功能后，本主题原本的启动耗时，由每次 13s 左右 优化到 二次启动时 1.2s 左右。
 * 基本只剩下 vuepress 本身的开销和 加载 shiki 所有语言带来 0.5s 左右的开销。
 */
import { createHash } from 'node:crypto'
import process from 'node:process'
import { fs, path } from 'vuepress/utils'
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'

export interface CacheData {
  content: string
  env: MarkdownEnv
}

// { [filepath]: CacheDta }
export type Cache = Record<string, CacheData>

// { [filepath]: hash }
export type Metadata = Record<string, string>

const CACHE_DIR = 'markdown/rendered'
const META_FILE = '_metadata.json'

export async function extendsMarkdown(md: Markdown, app: App): Promise<void> {
  if (app.env.isBuild && !fs.existsSync(app.dir.cache(CACHE_DIR))) {
    return
  }
  const basename = app.dir.cache(CACHE_DIR)

  await fs.ensureDir(basename)

  const speed = checkIOSpeed(basename)

  const metaFilepath = `${basename}/${META_FILE}`

  const metadata = (await readFile<Metadata>(metaFilepath)) || {}

  let timer: ReturnType<typeof setTimeout> | null = null
  const update = (filepath: string, data: CacheData): void => {
    writeFile(`${basename}/${filepath}`, data)

    timer && clearTimeout(timer)
    timer = setTimeout(async () => writeFile(metaFilepath, metadata), 200)
  }
  const rawRender = md.render
  md.render = (input, env: MarkdownEnv) => {
    const filepath = env.filePathRelative

    if (!filepath) {
      return rawRender(input, env)
    }

    const key = hash(input)
    const filename = normalizeFilename(filepath)

    if (metadata[filepath] === key) {
      const cached = readFileSync<CacheData>(`${basename}/${filename}`)
      if (cached) {
        Object.assign(env, cached.env)
        return cached.content
      }
      else {
        metadata[filepath] = ''
      }
    }
    const start = performance.now()
    const content = rawRender(input, env)

    /**
     * High-frequency I/O is also a time-consuming operation,
     * therefore, for render operations with low overhead, caching is not performed.
     */
    if (performance.now() - start > speed) {
      metadata[filepath] = key
      update(filename, { content, env })
    }
    return content
  }
}

function hash(data: string): string {
  return createHash('md5').update(data).digest('hex')
}

function normalizeFilename(filename: string): string {
  return hash(filename).slice(0, 10)
}

async function readFile<T = any>(filepath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content) as T
  }
  catch {
    return null
  }
}

function readFileSync<T = any>(filepath: string): T | null {
  try {
    const content = fs.readFileSync(filepath, 'utf-8')
    return JSON.parse(content) as T
  }
  catch {
    return null
  }
}

async function writeFile<T = any>(filepath: string, data: T): Promise<void> {
  return await fs.writeFile(filepath, JSON.stringify(data), 'utf-8')
}

export function checkIOSpeed(cwd = process.cwd()): number {
  try {
    const tmp = path.join(cwd, 'tmp')
    fs.writeFileSync(tmp, '{}', 'utf-8')
    const start = performance.now()
    readFileSync(tmp)
    const end = performance.now()
    fs.unlinkSync(tmp)
    return end - start
  }
  catch {
    return 0.15
  }
}
