import type { App } from 'vuepress'
import type { Page } from 'vuepress/core'
import type { EncryptOptions, ThemePageData } from '../../shared/index.js'
import type { FsCache } from '../utils/index.js'
import { isNumber, isString, objectKeys, toArray } from '@pengzhanbo/utils'
import { encodeData, removeLeadingSlash } from '@vuepress/helper'
import pMap from 'p-map'
import { getThemeConfig } from '../loadConfig/index.js'
import { createFsCache, genEncrypt, hash, logger, perf, resolveContent, writeTemp } from '../utils/index.js'

export type EncryptConfig = readonly [
  keys: string, // keys
  rules: string, // rules
  global: number, // global
  admin: string, // admin
]

const isStringLike = (value: unknown): boolean => isString(value) || isNumber(value)

const separator = ':'
let contentHash = ''
let fsCache: FsCache<[string, EncryptConfig]> | null = null

/**
 * Prepare encryption configuration
 *
 * 准备加密配置，处理主题的加密选项并生成加密相关的临时文件
 */
export async function prepareEncrypt(app: App): Promise<void> {
  perf.mark('prepare:encrypt')
  const { encrypt } = getThemeConfig()
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
  await writeTemp(app, 'internal/encrypt.js', resolveContent(app, {
    name: 'encrypt',
    content: resolvedEncrypt,
  }))

  fsCache?.write([currentHash, resolvedEncrypt], app.env.isBuild)

  perf.log('prepare:encrypt')
}

/**
 * Check if a password value is usable
 *
 * 判断密码值是否可用
 */
function hasValidPassword(value: unknown): boolean {
  return toArray(value).some(item => isStringLike(item) && `${item}`.length > 0)
}

/**
 * Resolve passwords, dropping invalid (empty) entries with a build-time warning.
 *
 * An empty password still produces a valid bcrypt hash, but the client always
 * rejects empty input (`if (!password) return false`), which makes the page or
 * the whole site impossible to unlock. Such entries are dropped and reported
 * instead of silently locking the content forever.
 *
 * 解析密码，丢弃无效（空）项并在构建期给出提示。
 *
 * 空密码依然会生成合法的 bcrypt 哈希，但客户端始终拒绝空输入（`if (!password) return false`），
 * 这会导致页面或全站永远无法解锁。因此这里丢弃这些项并给出提示，而不是静默地永久锁定内容。
 */
function resolvePasswords(value: unknown, scope: string): string[] {
  const passwords: string[] = []
  for (const item of toArray(value)) {
    if (!isStringLike(item)) {
      logger.warn(`[encrypt] the password of ${scope} is not a string nor a number, it has been ignored.`)
      continue
    }
    const password = `${item}`
    if (!password.length) {
      logger.warn(`[encrypt] the password of ${scope} is empty, it has been ignored. An empty password can never be verified, the content would be locked forever.`)
      continue
    }
    passwords.push(password)
  }
  return passwords
}

async function resolveEncrypt(encrypt?: EncryptOptions): Promise<EncryptConfig> {
  const adminPasswords = resolvePasswords(encrypt?.admin, '`encrypt.admin`')

  if (encrypt?.global && !adminPasswords.length) {
    logger.warn('[encrypt] `encrypt.global` is enabled but no valid `encrypt.admin` password is configured, the site can never be unlocked.')
  }

  const admin = adminPasswords.length
    ? (await pMap(adminPasswords, item => genEncrypt(item))).join(separator)
    : ''

  // Rules without any valid password are dropped entirely: keeping them would make
  // matched pages locked while no password can ever be verified.
  // 没有任何有效密码的规则将整体丢弃：保留它们会让匹配的页面被锁定，却没有任何密码可以通过校验。
  const encryptRules = objectKeys(encrypt?.rules ?? {})
    .map(match => ({
      match,
      passwords: resolvePasswords(encrypt!.rules![match], `\`encrypt.rules['${match}']\``),
    }))
    .filter(({ passwords }) => passwords.length)

  const keys = encryptRules.map(({ match }) => encodeData(`${match}`))
  const rules: Record<string, string> = {}

  for (const [index, { passwords }] of encryptRules.entries()) {
    rules[String(index)] = (await pMap(passwords, item => genEncrypt(item))).join(separator)
  }

  return [
    encodeData(JSON.stringify(keys)), // keys
    encodeData(JSON.stringify(rules)), // rules
    encrypt?.global ? 1 : 0, // global
    admin, // admin
  ]
}

const patternCache = new Map<string, RegExp>()
/**
 * Check if a page is encrypted
 *
 * 检查页面是否需要加密，根据页面的路径或文件相对路径匹配加密规则
 */
export function isEncryptPage(page: Page<ThemePageData>, encrypt?: EncryptOptions): boolean {
  if (!encrypt)
    return false

  if (page.data._e)
    return true

  const rules = encrypt.rules ?? {}

  return objectKeys(rules).some((match) => {
    // Keep in sync with `resolveEncrypt`: rules without a valid password are ignored,
    // otherwise the page would be treated as encrypted while it can never be unlocked.
    // 与 `resolveEncrypt` 保持一致：没有有效密码的规则会被忽略，
    // 否则页面会被当作已加密，但却永远无法解锁。
    if (!hasValidPassword(rules[match]))
      return false

    match = `${match}`
    const relativePath = page.data.filePathRelative || ''
    if (match[0] === '^') {
      let regex = patternCache.get(match)
      if (!regex) {
        regex = new RegExp(match)
        patternCache.set(match, regex)
      }
      return regex.test(page.path) || regex.test(relativePath)
    }
    if (match.endsWith('.md'))
      return relativePath.endsWith(match)

    return page.path.startsWith(match) || relativePath.startsWith(removeLeadingSlash(match))
  })
}
