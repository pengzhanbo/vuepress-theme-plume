import type { App } from 'vuepress'
import type { ThemeOptions } from '../../shared/index.js'
import type { FsCache } from '../utils/index.js'
import { type EncryptConfig, resolveEncrypt } from '../features/encrypt.js'
import { getThemeOptions } from '../options.js'
import { createFsCache, genTempCode, hash, perf, writeTemp } from '../utils/index.js'

let contentHash = ''
let fsCache: FsCache<[string, EncryptConfig]> | null = null

/**
 * Prepare encryption configuration
 *
 * 准备加密配置，处理主题的加密选项并生成加密相关的临时文件
 *
 * @param app - VuePress application instance / VuePress 应用实例
 * @param options - Theme options, defaults to `getThemeOptions()` / 主题配置，默认从 `getThemeOptions()` 读取
 */
export async function prepareEncrypt(app: App, options: ThemeOptions = getThemeOptions()): Promise<void> {
  perf.mark('prepare:encrypt')

  const { encrypt } = options
  if (!fsCache && app.env.isDev) {
    fsCache = createFsCache(app, 'encrypt')
    await fsCache.read()
  }
  contentHash = fsCache?.data?.[0] ?? ''
  let resolvedEncrypt = fsCache?.data?.[1]
  const currentHash = encrypt ? hash(JSON.stringify(encrypt)) : ''

  if (!contentHash || contentHash !== currentHash || !resolvedEncrypt) {
    contentHash = currentHash
    resolvedEncrypt = await resolveEncrypt(encrypt)
  }
  await writeTemp(
    app,
    'internal/encrypt.js',
    genTempCode(app, { name: 'encrypt', content: resolvedEncrypt }),
  )

  fsCache?.write([currentHash, resolvedEncrypt], app.env.isBuild)

  perf.log('prepare:encrypt')
}
