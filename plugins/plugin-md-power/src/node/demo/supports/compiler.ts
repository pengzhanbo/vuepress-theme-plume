import type { OutputChunk } from 'rolldown'
import { randomUUID } from 'node:crypto'
import { tmpdir } from 'node:os'
import { isPackageExists } from 'local-pkg'
import { LRUCache } from 'lru-cache'
import { fs, hash, path } from 'vuepress/utils'
import { interopDefault } from '../../utils/package.js'

const cache = new LRUCache({ max: 64 })

const compiler = {
  script: importer(async () => {
    const { rolldown } = await import('rolldown')
    return async (source: string, type: 'ts' | 'js') => {
      const tmpfile = path.join(tmpdir(), `${hash(source)}-${randomUUID()}.${type}`)
      await fs.writeFile(tmpfile, source, 'utf-8')
      const bundle = await rolldown({ input: tmpfile, platform: 'browser', treeshake: false, tsconfig: false })
      const result = await bundle.generate({ format: 'cjs', sourcemap: false, codeSplitting: false, minify: true })
      await bundle.close()
      await fs.unlink(tmpfile)
      const entryChunk = result.output.find(
        (chunk): chunk is OutputChunk => chunk.type === 'chunk' && chunk.isEntry,
      )!
      return entryChunk.code
    }
  }),
  less: importer(() => import('less')),
  sass: importer(async () => {
    if (isPackageExists('sass-embedded')) {
      return await import('sass-embedded')
    }
    return await import('sass')
  }),
  stylus: importer(() => import('stylus')),
}

export async function compileScript(source: string, type: 'ts' | 'js'): Promise<string> {
  const key = hash(`${type}:${source}`)
  if (cache.has(key))
    return cache.get(key) as string
  const transform = await compiler.script()
  const res = await transform(source, type)
  cache.set(key, res)
  return res
}

export async function compileStyle(source: string, type: 'css' | 'less' | 'scss' | 'stylus'): Promise<string> {
  const key = hash(`${type}:${source}`)
  if (cache.has(key))
    return cache.get(key) as string
  if (type === 'css')
    return source
  if (type === 'less') {
    const less = await compiler.less()
    const res = await less.render(source)
    cache.set(key, res.css)
    return res.css
  }
  if (type === 'scss') {
    const sass = await compiler.sass()
    const res = sass.compileString(source)
    cache.set(key, res.css)
    return res.css
  }
  if (type === 'stylus') {
    const stylus = await compiler.stylus()
    const res = stylus.render(source)
    cache.set(key, res)
    return res
  }
  return source
}

export function importer<T>(func: () => T): () => Promise<T> {
  let imported: T
  return async () => {
    if (!imported) {
      imported = interopDefault(await func()) as T
    }
    return imported
  }
}
