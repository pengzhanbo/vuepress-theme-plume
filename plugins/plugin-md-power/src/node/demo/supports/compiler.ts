import { isPackageExists } from 'local-pkg'
import { LRUCache } from 'lru-cache'
import { interopDefault } from '../../utils/package.js'

const cache = new LRUCache({ max: 64 })

const compiler = {
  script: importer(async () => {
    const { transform } = await import('esbuild')
    return transform
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
  const key = `${type}:::${source}`
  if (cache.has(key))
    return cache.get(key) as string
  const transform = await compiler.script()
  const res = await transform(source, {
    target: 'es2018',
    platform: 'browser',
    format: 'cjs',
    loader: type === 'ts' ? 'ts' : 'js',
    sourcemap: false,
  })
  cache.set(key, res.code)
  return res.code
}

export async function compileStyle(source: string, type: 'css' | 'less' | 'scss' | 'stylus'): Promise<string> {
  const key = `${type}:::${source}`
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
