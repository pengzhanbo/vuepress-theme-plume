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
import type { App } from 'vuepress'
import type { Markdown, MarkdownEnv } from 'vuepress/markdown'
import { fs } from 'vuepress/utils'

interface CacheContent {
  content: string
  env: MarkdownEnv
}

const cacheDir = 'markdown/render'
const metaFile = '_metadata.json'

export async function extendsMarkdown(md: Markdown, app: App): Promise<void> {
  // 如果是在 构建阶段，且缓存文件夹不存在，则不进行缓存
  // 因为构建阶段仅一次性产物，生成缓存资源反而会带来额外的开销
  if (app.env.isBuild && !fs.existsSync(app.dir.cache())) {
    return
  }

  await fs.ensureDir(app.dir.cache(cacheDir))
  const metadata = await readMetadata(app)

  const writeCache = (filepath: string, cache: CacheContent) => {
    const cachePath = app.dir.cache(cacheDir, filepath)
    const content = JSON.stringify(cache)
    fs.writeFileSync(cachePath, content, 'utf-8')
  }

  const readCache = (filepath: string): CacheContent | null => {
    const cachePath = app.dir.cache(cacheDir, filepath)
    try {
      const content = fs.readFileSync(cachePath, 'utf-8')
      return JSON.parse(content) as CacheContent
    }
    catch {}

    return null
  }

  const rawRender = md.render
  md.render = (input, env: MarkdownEnv) => {
    const filepath = env.filePathRelative

    if (!filepath) {
      return rawRender(input, env)
    }

    const hash = getContentHash(input)
    const cachePath = normalizePath(filepath)

    if (metadata[filepath] === hash) {
      const cache = readCache(cachePath)
      if (cache) {
        Object.assign(env, cache.env)
        return cache.content
      }
    }

    metadata[filepath] = hash

    const renderedContent = rawRender(input, env)

    writeCache(cachePath, { content: renderedContent, env })
    updateMetadata(app, metadata)
    return renderedContent
  }
}

async function readMetadata(app: App): Promise<Record<string, string>> {
  const filepath = app.dir.cache(cacheDir, metaFile)
  try {
    const content = await fs.readFile(filepath, 'utf-8')
    return JSON.parse(content)
  }
  catch {}
  return {}
}

let timer: NodeJS.Timeout | null = null
function updateMetadata(app: App, metadata: Record<string, string>) {
  const filepath = app.dir.cache(cacheDir, metaFile)
  timer && clearTimeout(timer)
  timer = setTimeout(
    async () => await fs.writeFile(filepath, JSON.stringify(metadata), 'utf-8'),
    200,
  )
}

function normalizePath(filepath: string) {
  return getContentHash(filepath)
}

function getContentHash(content: string): string {
  const hash = createHash('md5')
  hash.update(content)
  return hash.digest('hex')
}
